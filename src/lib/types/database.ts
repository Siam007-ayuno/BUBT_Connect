export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          full_name_bn: string | null
          email: string
          role: Database['public']['Enums']['user_role']
          avatar_url: string | null
          department_id: string | null
          batch_id: string | null
          student_id: string | null
          phone: string | null
          bio: string | null
          is_verified: boolean
          is_banned: boolean
          verification_status: Database['public']['Enums']['verification_status']
          settings: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          full_name_bn?: string | null
          email: string
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          department_id?: string | null
          batch_id?: string | null
          student_id?: string | null
          phone?: string | null
          bio?: string | null
          is_verified?: boolean
          is_banned?: boolean
          verification_status?: Database['public']['Enums']['verification_status']
          settings?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          full_name_bn?: string | null
          email?: string
          role?: Database['public']['Enums']['user_role']
          avatar_url?: string | null
          department_id?: string | null
          batch_id?: string | null
          student_id?: string | null
          phone?: string | null
          bio?: string | null
          is_verified?: boolean
          is_banned?: boolean
          verification_status?: Database['public']['Enums']['verification_status']
          settings?: Json | null
        }
      }
      departments: {
        Row: { id: string; created_at: string; name_en: string; name_bn: string; code: string }
        Insert: { id?: string; created_at?: string; name_en: string; name_bn: string; code: string }
        Update: { id?: string; created_at?: string; name_en?: string; name_bn?: string; code?: string }
      }
      batches: {
        Row: { id: string; created_at: string; department_id: string; number: number; start_year: number }
        Insert: { id?: string; created_at?: string; department_id: string; number: number; start_year: number }
        Update: { id?: string; created_at?: string; department_id?: string; number?: number; start_year?: number }
      }
      post_categories: {
        Row: { id: string; created_at?: string; name_en: string; name_bn: string; slug: string; icon: string | null; sort_order: number }
        Insert: { id?: string; created_at?: string; name_en: string; name_bn: string; slug: string; icon?: string | null; sort_order?: number }
        Update: { id?: string; created_at?: string; name_en?: string; name_bn?: string; slug?: string; icon?: string | null; sort_order?: number }
      }
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          body: string
          author_id: string
          type: Database['public']['Enums']['post_type']
          status: Database['public']['Enums']['post_status']
          category_id: string
          department_id: string | null
          is_anonymous: boolean
          improvement_suggestion: string | null
          upvote_count: number
          downvote_count: number
          comment_count: number
          is_escalated: boolean
          is_pinned: boolean
          attachments: any[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          body: string
          author_id: string
          type: Database['public']['Enums']['post_type']
          status?: Database['public']['Enums']['post_status']
          category_id: string
          department_id?: string | null
          is_anonymous?: boolean
          improvement_suggestion?: string | null
          upvote_count?: number
          downvote_count?: number
          comment_count?: number
          is_escalated?: boolean
          is_pinned?: boolean
          attachments?: any[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          body?: string
          author_id?: string
          type?: Database['public']['Enums']['post_type']
          status?: Database['public']['Enums']['post_status']
          category_id?: string
          department_id?: string | null
          is_anonymous?: boolean
          improvement_suggestion?: string | null
          upvote_count?: number
          downvote_count?: number
          comment_count?: number
          is_escalated?: boolean
          is_pinned?: boolean
          attachments?: any[] | null
        }
      }
      comments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          body: string
          author_id: string
          post_id: string
          parent_id: string | null
          is_anonymous: boolean
          is_official_response: boolean
          upvote_count: number
          attachments: any[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          body: string
          author_id: string
          post_id: string
          parent_id?: string | null
          is_anonymous?: boolean
          is_official_response?: boolean
          upvote_count?: number
          attachments?: any[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          body?: string
          author_id?: string
          post_id?: string
          parent_id?: string | null
          is_anonymous?: boolean
          is_official_response?: boolean
          upvote_count?: number
          attachments?: any[] | null
        }
      }
      votes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          value: Database['public']['Enums']['vote_value']
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          value: Database['public']['Enums']['vote_value']
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          value?: Database['public']['Enums']['vote_value']
        }
      }
      bookmarks: {
        Row: { id: string; created_at: string; user_id: string; post_id: string }
        Insert: { id?: string; created_at?: string; user_id: string; post_id: string }
        Update: { id?: string; created_at?: string; user_id?: string; post_id?: string }
      }
      post_status_history: {
        Row: { id: string; created_at: string; post_id: string; status: Database['public']['Enums']['post_status']; changed_by: string; note: string | null }
        Insert: { id?: string; created_at?: string; post_id: string; status: Database['public']['Enums']['post_status']; changed_by: string; note?: string | null }
        Update: { id?: string; created_at?: string; post_id?: string; status?: Database['public']['Enums']['post_status']; changed_by?: string; note?: string | null }
      }
      reports: {
        Row: {
          id: string
          created_at: string
          reporter_id: string
          post_id: string | null
          comment_id: string | null
          profile_id: string | null
          reason: Database['public']['Enums']['report_reason']
          details: string | null
          status: Database['public']['Enums']['report_status']
          reviewed_by: string | null
          reviewed_at: string | null
          action_taken: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          reporter_id: string
          post_id?: string | null
          comment_id?: string | null
          profile_id?: string | null
          reason: Database['public']['Enums']['report_reason']
          details?: string | null
          status?: Database['public']['Enums']['report_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          action_taken?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          reporter_id?: string
          post_id?: string | null
          comment_id?: string | null
          profile_id?: string | null
          reason?: Database['public']['Enums']['report_reason']
          details?: string | null
          status?: Database['public']['Enums']['report_status']
          reviewed_by?: string | null
          reviewed_at?: string | null
          action_taken?: string | null
        }
      }
      notices: {
        Row: { id: string; created_at: string; updated_at: string; title: string; content: string; author_id: string; category: Database['public']['Enums']['notice_category']; target_roles: Database['public']['Enums']['user_role'][] | null; target_departments: string[] | null; target_batches: string[] | null; is_pinned: boolean; expires_at: string | null; attachment_url: string | null }
        Insert: { id?: string; created_at?: string; updated_at?: string; title: string; content: string; author_id: string; category: Database['public']['Enums']['notice_category']; target_roles?: Database['public']['Enums']['user_role'][] | null; target_departments?: string[] | null; target_batches?: string[] | null; is_pinned?: boolean; expires_at?: string | null; attachment_url?: string | null }
        Update: { id?: string; created_at?: string; updated_at?: string; title?: string; content?: string; author_id?: string; category?: Database['public']['Enums']['notice_category']; target_roles?: Database['public']['Enums']['user_role'][] | null; target_departments?: string[] | null; target_batches?: string[] | null; is_pinned?: boolean; expires_at?: string | null; attachment_url?: string | null }
      }
      notice_reads: {
        Row: { id: string; created_at: string; user_id: string; notice_id: string }
        Insert: { id?: string; created_at?: string; user_id: string; notice_id: string }
        Update: { id?: string; created_at?: string; user_id?: string; notice_id?: string }
      }
      events: {
        Row: { id: string; created_at: string; updated_at: string; title: string; description: string; type: Database['public']['Enums']['event_type']; organizer_id: string; club_id: string | null; start_time: string; end_time: string; location: string; is_approved: boolean; max_capacity: number | null; cover_image_url: string | null }
        Insert: { id?: string; created_at?: string; updated_at?: string; title: string; description: string; type: Database['public']['Enums']['event_type']; organizer_id: string; club_id?: string | null; start_time: string; end_time: string; location: string; is_approved?: boolean; max_capacity?: number | null; cover_image_url?: string | null }
        Update: { id?: string; created_at?: string; updated_at?: string; title?: string; description?: string; type?: Database['public']['Enums']['event_type']; organizer_id?: string; club_id?: string | null; start_time?: string; end_time?: string; location?: string; is_approved?: boolean; max_capacity?: number | null; cover_image_url?: string | null }
      }
      event_rsvps: {
        Row: { id: string; created_at: string; user_id: string; event_id: string; status: Database['public']['Enums']['rsvp_status'] }
        Insert: { id?: string; created_at?: string; user_id: string; event_id: string; status: Database['public']['Enums']['rsvp_status'] }
        Update: { id?: string; created_at?: string; user_id?: string; event_id?: string; status?: Database['public']['Enums']['rsvp_status'] }
      }
      clubs: {
        Row: { id: string; created_at: string; updated_at: string; name: string; description: string; logo_url: string | null; faculty_advisor_id: string | null; established_date: string | null }
        Insert: { id?: string; created_at?: string; updated_at?: string; name: string; description: string; logo_url?: string | null; faculty_advisor_id?: string | null; established_date?: string | null }
        Update: { id?: string; created_at?: string; updated_at?: string; name?: string; description?: string; logo_url?: string | null; faculty_advisor_id?: string | null; established_date?: string | null }
      }
      club_members: {
        Row: { id: string; created_at: string; user_id: string; club_id: string; role: Database['public']['Enums']['club_member_role']; status: Database['public']['Enums']['club_member_status']; joined_at: string }
        Insert: { id?: string; created_at?: string; user_id: string; club_id: string; role?: Database['public']['Enums']['club_member_role']; status?: Database['public']['Enums']['club_member_status']; joined_at?: string }
        Update: { id?: string; created_at?: string; user_id?: string; club_id?: string; role?: Database['public']['Enums']['club_member_role']; status?: Database['public']['Enums']['club_member_status']; joined_at?: string }
      }
      alumni_profiles: {
        Row: { id: string; created_at: string; updated_at: string; user_id: string; graduation_year: number; current_company: string | null; current_position: string | null; linkedin_url: string | null; is_mentor: boolean }
        Insert: { id?: string; created_at?: string; updated_at?: string; user_id: string; graduation_year: number; current_company?: string | null; current_position?: string | null; linkedin_url?: string | null; is_mentor?: boolean }
        Update: { id?: string; created_at?: string; updated_at?: string; user_id?: string; graduation_year?: number; current_company?: string | null; current_position?: string | null; linkedin_url?: string | null; is_mentor?: boolean }
      }
      alumni_advice: {
        Row: { id: string; created_at: string; updated_at: string; author_id: string; category: Database['public']['Enums']['alumni_advice_category']; title: string; content: string }
        Insert: { id?: string; created_at?: string; updated_at?: string; author_id: string; category: Database['public']['Enums']['alumni_advice_category']; title: string; content: string }
        Update: { id?: string; created_at?: string; updated_at?: string; author_id?: string; category?: Database['public']['Enums']['alumni_advice_category']; title?: string; content?: string }
      }
      mentorship_requests: {
        Row: { id: string; created_at: string; updated_at: string; mentee_id: string; mentor_id: string; message: string; status: Database['public']['Enums']['mentorship_status'] }
        Insert: { id?: string; created_at?: string; updated_at?: string; mentee_id: string; mentor_id: string; message: string; status?: Database['public']['Enums']['mentorship_status'] }
        Update: { id?: string; created_at?: string; updated_at?: string; mentee_id?: string; mentor_id?: string; message?: string; status?: Database['public']['Enums']['mentorship_status'] }
      }
      jobs: {
        Row: { id: string; created_at: string; updated_at: string; author_id: string; title: string; company: string; location: string; type: Database['public']['Enums']['job_type']; description: string; link: string | null; expires_at: string | null }
        Insert: { id?: string; created_at?: string; updated_at?: string; author_id: string; title: string; company: string; location: string; type: Database['public']['Enums']['job_type']; description: string; link?: string | null; expires_at?: string | null }
        Update: { id?: string; created_at?: string; updated_at?: string; author_id?: string; title?: string; company?: string; location?: string; type?: Database['public']['Enums']['job_type']; description?: string; link?: string | null; expires_at?: string | null }
      }
      resources: {
        Row: { id: string; created_at: string; updated_at: string; uploader_id: string; title: string; description: string | null; type: Database['public']['Enums']['resource_type']; course_code: string | null; department_id: string | null; file_url: string }
        Insert: { id?: string; created_at?: string; updated_at?: string; uploader_id: string; title: string; description?: string | null; type: Database['public']['Enums']['resource_type']; course_code?: string | null; department_id?: string | null; file_url: string }
        Update: { id?: string; created_at?: string; updated_at?: string; uploader_id?: string; title?: string; description?: string | null; type?: Database['public']['Enums']['resource_type']; course_code?: string | null; department_id?: string | null; file_url?: string }
      }
      course_feedback: {
        Row: { id: string; created_at: string; student_id: string; course_code: string; semester: string; rating: number; review: string; is_anonymous: boolean }
        Insert: { id?: string; created_at?: string; student_id: string; course_code: string; semester: string; rating: number; review: string; is_anonymous?: boolean }
        Update: { id?: string; created_at?: string; student_id?: string; course_code?: string; semester?: string; rating?: number; review?: string; is_anonymous?: boolean }
      }
      polls: {
        Row: { id: string; created_at: string; updated_at: string; author_id: string; question: string; is_multiple_choice: boolean; expires_at: string | null }
        Insert: { id?: string; created_at?: string; updated_at?: string; author_id: string; question: string; is_multiple_choice?: boolean; expires_at?: string | null }
        Update: { id?: string; created_at?: string; updated_at?: string; author_id?: string; question?: string; is_multiple_choice?: boolean; expires_at?: string | null }
      }
      poll_options: {
        Row: { id: string; created_at: string; poll_id: string; text: string }
        Insert: { id?: string; created_at?: string; poll_id: string; text: string }
        Update: { id?: string; created_at?: string; poll_id?: string; text?: string }
      }
      poll_votes: {
        Row: { id: string; created_at: string; user_id: string; poll_id: string; option_id: string }
        Insert: { id?: string; created_at?: string; user_id: string; poll_id: string; option_id: string }
        Update: { id?: string; created_at?: string; user_id?: string; poll_id?: string; option_id?: string }
      }
      lost_found: {
        Row: { id: string; created_at: string; updated_at: string; reporter_id: string; type: Database['public']['Enums']['lost_found_type']; item_name: string; description: string; location: string; date: string; image_url: string | null; is_resolved: boolean }
        Insert: { id?: string; created_at?: string; updated_at?: string; reporter_id: string; type: Database['public']['Enums']['lost_found_type']; item_name: string; description: string; location: string; date: string; image_url?: string | null; is_resolved?: boolean }
        Update: { id?: string; created_at?: string; updated_at?: string; reporter_id?: string; type?: Database['public']['Enums']['lost_found_type']; item_name?: string; description?: string; location?: string; date?: string; image_url?: string | null; is_resolved?: boolean }
      }
      notifications: {
        Row: { id: string; created_at: string; user_id: string; type: Database['public']['Enums']['notification_type']; actor_id: string | null; post_id: string | null; comment_id: string | null; event_id: string | null; notice_id: string | null; content: string; is_read: boolean }
        Insert: { id?: string; created_at?: string; user_id: string; type: Database['public']['Enums']['notification_type']; actor_id?: string | null; post_id?: string | null; comment_id?: string | null; event_id?: string | null; notice_id?: string | null; content: string; is_read?: boolean }
        Update: { id?: string; created_at?: string; user_id?: string; type?: Database['public']['Enums']['notification_type']; actor_id?: string | null; post_id?: string | null; comment_id?: string | null; event_id?: string | null; notice_id?: string | null; content?: string; is_read?: boolean }
      }
      audit_logs: {
        Row: { id: string; created_at: string; actor_id: string; action: string; target_table: string; target_id: string; changes: Json | null }
        Insert: { id?: string; created_at?: string; actor_id: string; action: string; target_table: string; target_id: string; changes?: Json | null }
        Update: { id?: string; created_at?: string; actor_id?: string; action?: string; target_table?: string; target_id?: string; changes?: Json | null }
      }
      directory_entries: {
        Row: { id: string; created_at: string; name: string; role_title: string; department: string | null; email: string | null; phone: string | null; room_number: string | null }
        Insert: { id?: string; created_at?: string; name: string; role_title: string; department?: string | null; email?: string | null; phone?: string | null; room_number?: string | null }
        Update: { id?: string; created_at?: string; name?: string; role_title?: string; department?: string | null; email?: string | null; phone?: string | null; room_number?: string | null }
      }
      satisfaction_ratings: {
        Row: { id: string; created_at: string; user_id: string; target_type: string; target_id: string; rating: number; feedback: string | null }
        Insert: { id?: string; created_at?: string; user_id: string; target_type: string; target_id: string; rating: number; feedback?: string | null }
        Update: { id?: string; created_at?: string; user_id?: string; target_type?: string; target_id?: string; rating?: number; feedback?: string | null }
      }
    }
    Views: {
      posts_public: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          body: string
          author_id: string | null
          type: Database['public']['Enums']['post_type']
          status: Database['public']['Enums']['post_status']
          category_id: string
          department_id: string | null
          is_anonymous: boolean
          improvement_suggestion: string | null
          upvotes: number
          downvotes: number
          view_count: number
        }
      }
    }
    Enums: {
      user_role: 'student' | 'faculty' | 'authority' | 'alumni' | 'super_admin'
      post_type: 'problem' | 'suggestion' | 'question' | 'discussion'
      post_status: 'open' | 'under_review' | 'in_progress' | 'resolved' | 'rejected'
      report_reason: 'spam' | 'harassment' | 'hate_speech' | 'misinformation' | 'other'
      report_status: 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
      notice_category: 'exam' | 'admission' | 'result' | 'holiday' | 'fees' | 'scholarship' | 'general'
      event_type: 'seminar' | 'workshop' | 'club_event' | 'sports' | 'cultural' | 'career_fair' | 'exam_schedule' | 'alumni_meetup'
      rsvp_status: 'going' | 'interested' | 'not_going'
      club_member_role: 'president' | 'vice_president' | 'secretary' | 'member'
      club_member_status: 'pending' | 'active' | 'removed'
      verification_status: 'pending' | 'approved' | 'rejected'
      vote_value: 1 | -1
      alumni_advice_category: 'career' | 'study_tips' | 'industry_insights' | 'university_feedback' | 'success_story' | 'ama'
      job_type: 'full_time' | 'part_time' | 'internship' | 'freelance'
      resource_type: 'note' | 'past_question' | 'slide' | 'book' | 'other'
      notification_type: 'vote' | 'comment' | 'mention' | 'notice' | 'event' | 'status_change' | 'moderation' | 'mentorship' | 'system'
      mentorship_status: 'pending' | 'accepted' | 'declined'
      lost_found_type: 'lost' | 'found'
    }
  }
}
