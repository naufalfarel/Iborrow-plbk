export type UserRole = 'mahasiswa' | 'dosen' | 'staf' | 'admin'
export type BorrowStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'dipinjam' | 'dikembalikan' | 'terlambat'
export type ItemCondition = 'baik' | 'rusak_ringan' | 'rusak_berat'

export interface SharedUser {
  id: number
  fullName: string
  email: string
  role: UserRole
  nimNip: string | null
}

export interface SharedProps {
  user: SharedUser | null
  flash: {
    success: string | null
    error: string | null
  }
  [key: string]: unknown
}

export interface Item {
  id: number
  code: string
  name: string
  category: string
  description: string | null
  stockTotal: number
  stockAvailable: number
  condition: ItemCondition
  imageUrl: string | null
  isActive: boolean
}

export interface Borrow {
  id: number
  borrowCode: string
  userId: number
  itemId: number
  quantity: number
  borrowDate: string
  returnDate: string
  actualReturnDate: string | null
  status: BorrowStatus
  purpose: string
  notes: string | null
  itemConditionOnReturn: ItemCondition | null
  user?: SharedUser
  item?: Item
  reviewer?: SharedUser | null
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'approved' | 'rejected' | 'reminder' | 'info' | 'returned'
  isRead: boolean
  createdAt: string
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface Paginated<T> {
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
  data: T[]
}
