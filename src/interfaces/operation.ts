interface Links {
    self: { href: string };
    transaction: { href: string };
    effects: { href: string };
    succeeds: { href: string };
    precedes: { href: string };
}
  
export interface OperationType {
    _links: Links;
    id: string;
    paging_token: string;
    transaction_successful: boolean;
    source_account: string;
    type: string;
    type_i: number;
    created_at: string;
    transaction_hash: string;
    starting_balance?: string;
    funder?: string;
    account?: string;
    claimant?: string;
    seller?: string;
    offer_id?: string;
    to?: string;
    from?: string;
    amount?: string;
    asset_type?: string;
    into?: string;
  }
  