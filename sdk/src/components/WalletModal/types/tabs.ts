import { IconType } from 'react-icons'

export type TabViewType =
  | 'overview'
  | 'send'
  | 'receive'
  | 'buy'
  | 'transactions'
  | 'view-funds'
  | 'switch-account'

export interface TabItem {
  label: string
  value: TabViewType
  icon?: IconType
}
