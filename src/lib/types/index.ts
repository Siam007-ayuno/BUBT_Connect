import type { Database } from './database'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

export type Profile = Tables<'profiles'> & {
  blood_group?: string
}
export type Post = Tables<'posts'>
export type Comment = Tables<'comments'>
export type Vote = Tables<'votes'>
export type Notice = Tables<'notices'>
export type Event = Tables<'events'>
export type Club = Tables<'clubs'>
export type AlumniProfile = Tables<'alumni_profiles'>
export type Job = Tables<'jobs'>
export type Notification = Tables<'notifications'>
export type PostCategory = Tables<'post_categories'>
export type Department = Tables<'departments'>
export type Batch = Tables<'batches'>

export type UserRole = Enums<'user_role'>
export type PostType = Enums<'post_type'>
export type PostStatus = Enums<'post_status'>
export type NoticeCategory = Enums<'notice_category'>
export type EventType = Enums<'event_type'>
