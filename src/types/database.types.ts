export interface ContactEntity {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: "PRIMARY" | "SECONDARY";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ContactCreateInput {
  email?: string;
  phoneNumber?: number;
  linkedId?: number;
  linkPrecedence: "PRIMARY" | "SECONDARY";
}

export interface ContactUpdateInput {
  phoneNumber?: string;
  email?: string;
  linkedId?: number;
  linkPrecedence?: "PRIMARY" | "SECONDARY";
  deletedAt?: Date;
}
