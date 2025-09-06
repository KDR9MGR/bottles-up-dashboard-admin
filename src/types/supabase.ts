export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          phone_number: string | null
          age: number | null
          created_at: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone_number?: string | null
          age?: number | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone_number?: string | null
          age?: number | null
          created_at?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          email: string
          name: string
          business_name: string | null
          phone_number: string | null
          profile_image_url: string | null
          is_verified: boolean | null
          created_at: string | null
          last_login_at: string | null
          permissions: string[] | null
          role: string | null
          start_time: string | null
          close_time: string | null
          advance_booking_hours: number | null
          is_online: boolean | null
          last_online_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          business_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          is_verified?: boolean | null
          created_at?: string | null
          last_login_at?: string | null
          permissions?: string[] | null
          role?: string | null
          start_time?: string | null
          close_time?: string | null
          advance_booking_hours?: number | null
          is_online?: boolean | null
          last_online_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          business_name?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          is_verified?: boolean | null
          created_at?: string | null
          last_login_at?: string | null
          permissions?: string[] | null
          role?: string | null
          start_time?: string | null
          close_time?: string | null
          advance_booking_hours?: number | null
          is_online?: boolean | null
          last_online_at?: string | null
        }
      }
      clubs: {
        Row: {
          id: string
          name: string
          location: string
          description: string | null
          price_min: number | null
          price_max: number | null
          avg_rating: number | null
          review_count: number | null
          image_url: string | null
          phone: string | null
          email: string | null
          website_url: string | null
          opening_hours: any | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          category_id: string | null
          dress_code: string | null
          age_requirement: string | null
        }
        Insert: {
          id?: string
          name: string
          location: string
          description?: string | null
          price_min?: number | null
          price_max?: number | null
          avg_rating?: number | null
          review_count?: number | null
          image_url?: string | null
          phone?: string | null
          email?: string | null
          website_url?: string | null
          opening_hours?: any | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          category_id?: string | null
          dress_code?: string | null
          age_requirement?: string | null
        }
        Update: {
          id?: string
          name?: string
          location?: string
          description?: string | null
          price_min?: number | null
          price_max?: number | null
          avg_rating?: number | null
          review_count?: number | null
          image_url?: string | null
          phone?: string | null
          email?: string | null
          website_url?: string | null
          opening_hours?: any | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          category_id?: string | null
          dress_code?: string | null
          age_requirement?: string | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          club_id: string
          category_id: string | null
          event_date: string
          start_time: string | null
          end_time: string | null
          ticket_price: number | null
          max_capacity: number | null
          current_bookings: number | null
          image_url: string | null
          is_featured: boolean | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
          age_requirement: string | null
          dress_code: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          club_id: string
          category_id?: string | null
          event_date: string
          start_time?: string | null
          end_time?: string | null
          ticket_price?: number | null
          max_capacity?: number | null
          current_bookings?: number | null
          image_url?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          age_requirement?: string | null
          dress_code?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          club_id?: string
          category_id?: string | null
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          ticket_price?: number | null
          max_capacity?: number | null
          current_bookings?: number | null
          image_url?: string | null
          is_featured?: boolean | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          age_requirement?: string | null
          dress_code?: string | null
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Vendor = Database['public']['Tables']['vendors']['Row']
export type Club = Database['public']['Tables']['clubs']['Row']
export type Event = Database['public']['Tables']['events']['Row']