export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          dementia_user_id: string
          id: string
          is_resolved: boolean | null
          location_lat: number | null
          location_lng: number | null
          message: string
          resolved_at: string | null
          route_id: string | null
          severity: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          dementia_user_id: string
          id?: string
          is_resolved?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          message: string
          resolved_at?: string | null
          route_id?: string | null
          severity: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          dementia_user_id?: string
          id?: string
          is_resolved?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          message?: string
          resolved_at?: string | null
          route_id?: string | null
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_dementia_user_id_fkey"
            columns: ["dementia_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "safe_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      buddy_watch: {
        Row: {
          address: string | null
          created_at: string
          dementia_user_id: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          relation: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          dementia_user_id: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          relation?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          dementia_user_id?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          relation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buddy_watch_dementia_user_id_fkey"
            columns: ["dementia_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiving_relationships: {
        Row: {
          caregiver_id: string
          created_at: string
          dementia_user_id: string
          emergency_contact: boolean | null
          id: string
          relationship_type: string | null
        }
        Insert: {
          caregiver_id: string
          created_at?: string
          dementia_user_id: string
          emergency_contact?: boolean | null
          id?: string
          relationship_type?: string | null
        }
        Update: {
          caregiver_id?: string
          created_at?: string
          dementia_user_id?: string
          emergency_contact?: boolean | null
          id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregiving_relationships_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caregiving_relationships_dementia_user_id_fkey"
            columns: ["dementia_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_points: {
        Row: {
          created_at: string
          dementia_user_id: string
          description: string | null
          id: string
          latitude: number
          longitude: number
          name: string
          point_type: string
          route_id: string | null
        }
        Insert: {
          created_at?: string
          dementia_user_id: string
          description?: string | null
          id?: string
          latitude: number
          longitude: number
          name: string
          point_type: string
          route_id?: string | null
        }
        Update: {
          created_at?: string
          dementia_user_id?: string
          description?: string | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          point_type?: string
          route_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_points_dementia_user_id_fkey"
            columns: ["dementia_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_points_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "safe_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      location_tracking: {
        Row: {
          accuracy: number | null
          deviation_meters: number | null
          heading: number | null
          id: string
          is_on_route: boolean | null
          latitude: number
          longitude: number
          route_id: string | null
          speed: number | null
          timestamp: string
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          deviation_meters?: number | null
          heading?: number | null
          id?: string
          is_on_route?: boolean | null
          latitude: number
          longitude: number
          route_id?: string | null
          speed?: number | null
          timestamp?: string
          user_id: string
        }
        Update: {
          accuracy?: number | null
          deviation_meters?: number | null
          heading?: number | null
          id?: string
          is_on_route?: boolean | null
          latitude?: number
          longitude?: number
          route_id?: string | null
          speed?: number | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_tracking_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "safe_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          id: string
          phone: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          id: string
          phone?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      safe_routes: {
        Row: {
          created_at: string
          created_by: string
          dementia_user_id: string
          description: string | null
          distance_meters: number | null
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          path_data: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          dementia_user_id: string
          description?: string | null
          distance_meters?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          path_data: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          dementia_user_id?: string
          description?: string | null
          distance_meters?: number | null
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          path_data?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "safe_routes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safe_routes_dementia_user_id_fkey"
            columns: ["dementia_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_caregiver_for: {
        Args: { _caregiver_id: string; _dementia_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "caregiver" | "dementia_user"
      user_type: "caregiver" | "dementia_user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "caregiver", "dementia_user"],
      user_type: ["caregiver", "dementia_user"],
    },
  },
} as const
