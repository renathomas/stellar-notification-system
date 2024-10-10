interface TransactionLinks {
  self: { href: string };
  account: { href: string };
  ledger: { href: string };
  operations: { href: string; templated: boolean };
  effects: { href: string; templated: boolean };
  precedes: { href: string };
  succeeds: { href: string };
  transaction: { href: string };
}

interface TimeBounds {
  min_time: string;
  max_time: string;
}

interface Preconditions {
  timebounds: TimeBounds;
}

export interface Transaction {
  _links: TransactionLinks;
  id: string;
  paging_token: string;
  successful: boolean;
  hash: string;
  ledger: number;
  created_at: string;
  source_account: string;
  source_account_sequence: string;
  fee_account: string;
  fee_charged: string;
  max_fee: string;
  operation_count: number;
  envelope_xdr: string;
  result_xdr: string;
  result_meta_xdr: string;
  fee_meta_xdr: string;
  memo_type: string;
  signatures: string[];
  valid_after: string;
  valid_before: string;
  preconditions: Preconditions;
}
