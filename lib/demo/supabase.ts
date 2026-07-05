import { demoUser, getDemoTable } from "@/lib/demo/data";

type DemoRow = Record<string, unknown>;

function normalize(value: unknown) {
  return String(value ?? "").toLowerCase();
}

function matchesOr(row: DemoRow, expression: string) {
  return expression.split(",").some((condition) => {
    const [field, operator, rawValue] = condition.split(".");

    if (operator !== "ilike") return false;

    const needle = rawValue?.replaceAll("%", "").toLowerCase() ?? "";
    return normalize(row[field]).includes(needle);
  });
}

class DemoQueryBuilder {
  private rows: DemoRow[];
  private selectedCount = false;
  private singleMode = false;
  private maybeSingleMode = false;
  private rangeFrom: number | null = null;
  private rangeTo: number | null = null;
  private limitCount: number | null = null;
  private mutationResult: DemoRow[] | null = null;

  constructor(private table: string) {
    this.rows = getDemoTable(table) as DemoRow[];
  }

  select(_columns?: string, options?: { count?: "exact" }) {
    this.selectedCount = options?.count === "exact";
    return this;
  }

  insert(payload: DemoRow | DemoRow[]) {
    const rows = Array.isArray(payload) ? payload : [payload];
    this.mutationResult = rows.map((row, index) => ({
      id: row.id ?? `demo-${this.table}-${Date.now()}-${index}`,
      ...row,
    }));
    return this;
  }

  update(payload: DemoRow) {
    this.mutationResult = [{ id: `demo-${this.table}-updated`, ...payload }];
    return this;
  }

  delete() {
    this.mutationResult = [];
    return this;
  }

  eq(field: string, value: unknown) {
    this.rows = this.rows.filter((row) => row[field] === value);
    return this;
  }

  neq(field: string, value: unknown) {
    this.rows = this.rows.filter((row) => row[field] !== value);
    return this;
  }

  or(expression: string) {
    this.rows = this.rows.filter((row) => matchesOr(row, expression));
    return this;
  }

  order(field: string, options?: { ascending?: boolean }) {
    const ascending = options?.ascending ?? true;
    this.rows = [...this.rows].sort((a, b) => {
      const left = normalize(a[field]);
      const right = normalize(b[field]);
      return ascending ? left.localeCompare(right) : right.localeCompare(left);
    });
    return this;
  }

  range(from: number, to: number) {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleMode = true;
    return this;
  }

  maybeSingle() {
    this.maybeSingleMode = true;
    return this;
  }

  private async execute() {
    if (this.mutationResult) {
      const data = this.singleMode ? this.mutationResult[0] ?? null : this.mutationResult;
      return { data, error: null, count: this.selectedCount ? this.mutationResult.length : null };
    }

    const total = this.rows.length;
    let data = [...this.rows];

    if (this.rangeFrom !== null && this.rangeTo !== null) {
      data = data.slice(this.rangeFrom, this.rangeTo + 1);
    }

    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    if (this.singleMode || this.maybeSingleMode) {
      return { data: data[0] ?? null, error: null, count: this.selectedCount ? total : null };
    }

    return { data, error: null, count: this.selectedCount ? total : null };
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?:
      | ((value: Awaited<ReturnType<DemoQueryBuilder["execute"]>>) => TResult1 | PromiseLike<TResult1>)
      | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export function createDemoClient() {
  return {
    auth: {
      async getUser() {
        return { data: { user: demoUser }, error: null };
      },
      async signInWithPassword() {
        return { data: { user: demoUser }, error: null };
      },
      async signUp() {
        return { data: { user: demoUser }, error: null };
      },
      async resetPasswordForEmail() {
        return { data: {}, error: null };
      },
      async signOut() {
        return { error: null };
      },
    },
    from(table: string) {
      return new DemoQueryBuilder(table);
    },
  };
}
