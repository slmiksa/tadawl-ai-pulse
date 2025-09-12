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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          last_active: string | null
          password_hash: string
          permissions: Json | null
          role: string
          status: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_active?: string | null
          password_hash: string
          permissions?: Json | null
          role?: string
          status?: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_active?: string | null
          password_hash?: string
          permissions?: Json | null
          role?: string
          status?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key_value: string
          last_used: string | null
          name: string
          rate_limit: number | null
          requests_today: number | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key_value: string
          last_used?: string | null
          name: string
          rate_limit?: number | null
          requests_today?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key_value?: string
          last_used?: string | null
          name?: string
          rate_limit?: number | null
          requests_today?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      market_data: {
        Row: {
          close_price: number | null
          created_at: string | null
          date: string
          high_price: number | null
          id: string
          low_price: number | null
          open_price: number | null
          stock_id: string
          volume: number | null
        }
        Insert: {
          close_price?: number | null
          created_at?: string | null
          date: string
          high_price?: number | null
          id?: string
          low_price?: number | null
          open_price?: number | null
          stock_id: string
          volume?: number | null
        }
        Update: {
          close_price?: number | null
          created_at?: string | null
          date?: string
          high_price?: number | null
          id?: string
          low_price?: number | null
          open_price?: number | null
          stock_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_data_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          article_id: string
          category: string | null
          content: string | null
          created_at: string | null
          id: number
          image_url: string | null
          published_at: string | null
          source: string | null
          summary: string | null
          symbol: string | null
          title: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          article_id: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          published_at?: string | null
          source?: string | null
          summary?: string | null
          symbol?: string | null
          title: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          article_id?: string
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: number
          image_url?: string | null
          published_at?: string | null
          source?: string | null
          summary?: string | null
          symbol?: string | null
          title?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          display_order: number | null
          duration_months: number
          features: Json | null
          features_en: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          name_en: string | null
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_months?: number
          features?: Json | null
          features_en?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          name_en?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number | null
          duration_months?: number
          features?: Json | null
          features_en?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          name_en?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_holdings: {
        Row: {
          average_cost: number
          created_at: string | null
          current_value: number | null
          gain_loss: number | null
          gain_loss_percent: number | null
          id: string
          portfolio_id: string
          quantity: number
          stock_id: string
          updated_at: string | null
        }
        Insert: {
          average_cost: number
          created_at?: string | null
          current_value?: number | null
          gain_loss?: number | null
          gain_loss_percent?: number | null
          id?: string
          portfolio_id: string
          quantity?: number
          stock_id: string
          updated_at?: string | null
        }
        Update: {
          average_cost?: number
          created_at?: string | null
          current_value?: number | null
          gain_loss?: number | null
          gain_loss_percent?: number | null
          id?: string
          portfolio_id?: string
          quantity?: number
          stock_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_holdings_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          total_gain_loss: number | null
          total_gain_loss_percent: number | null
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          total_gain_loss?: number | null
          total_gain_loss_percent?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          total_gain_loss?: number | null
          total_gain_loss_percent?: number | null
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
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
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      stocks: {
        Row: {
          change: number | null
          change_percent: number | null
          created_at: string | null
          dividend_yield: number | null
          entry_signal: string | null
          entry_timing: string | null
          high: number | null
          id: string
          industry: string | null
          last_updated: string | null
          low: number | null
          macd_signal: string | null
          market: string
          market_cap: number | null
          name: string
          open: number | null
          pe_ratio: number | null
          price: number | null
          reason: string | null
          recommendation: string | null
          resistance_level_1: number | null
          resistance_level_2: number | null
          rsi: number | null
          sector: string | null
          success_probability: number | null
          support_level_1: number | null
          support_level_2: number | null
          symbol: string
          trading_volume_avg: number | null
          trend_strength: string | null
          volatility: number | null
          volume: number | null
        }
        Insert: {
          change?: number | null
          change_percent?: number | null
          created_at?: string | null
          dividend_yield?: number | null
          entry_signal?: string | null
          entry_timing?: string | null
          high?: number | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          low?: number | null
          macd_signal?: string | null
          market: string
          market_cap?: number | null
          name: string
          open?: number | null
          pe_ratio?: number | null
          price?: number | null
          reason?: string | null
          recommendation?: string | null
          resistance_level_1?: number | null
          resistance_level_2?: number | null
          rsi?: number | null
          sector?: string | null
          success_probability?: number | null
          support_level_1?: number | null
          support_level_2?: number | null
          symbol: string
          trading_volume_avg?: number | null
          trend_strength?: string | null
          volatility?: number | null
          volume?: number | null
        }
        Update: {
          change?: number | null
          change_percent?: number | null
          created_at?: string | null
          dividend_yield?: number | null
          entry_signal?: string | null
          entry_timing?: string | null
          high?: number | null
          id?: string
          industry?: string | null
          last_updated?: string | null
          low?: number | null
          macd_signal?: string | null
          market?: string
          market_cap?: number | null
          name?: string
          open?: number | null
          pe_ratio?: number | null
          price?: number | null
          reason?: string | null
          recommendation?: string | null
          resistance_level_1?: number | null
          resistance_level_2?: number | null
          rsi?: number | null
          sector?: string | null
          success_probability?: number | null
          support_level_1?: number | null
          support_level_2?: number | null
          symbol?: string
          trading_volume_avg?: number | null
          trend_strength?: string | null
          volatility?: number | null
          volume?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          package_type: string
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          package_type: string
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          package_type?: string
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          created_at: string | null
          fees: number | null
          id: string
          notes: string | null
          portfolio_id: string
          price: number
          quantity: number
          stock_id: string
          total_amount: number
          transaction_date: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          portfolio_id: string
          price: number
          quantity: number
          stock_id: string
          total_amount: number
          transaction_date?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          fees?: number | null
          id?: string
          notes?: string | null
          portfolio_id?: string
          price?: number
          quantity?: number
          stock_id?: string
          total_amount?: number
          transaction_date?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          currency: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          push_notifications: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          push_notifications?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlist_stocks: {
        Row: {
          added_at: string | null
          id: string
          stock_id: string
          watchlist_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          stock_id: string
          watchlist_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          stock_id?: string
          watchlist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlist_stocks_stock_id_fkey"
            columns: ["stock_id"]
            isOneToOne: false
            referencedRelation: "stocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "watchlist_stocks_watchlist_id_fkey"
            columns: ["watchlist_id"]
            isOneToOne: false
            referencedRelation: "watchlists"
            referencedColumns: ["id"]
          },
        ]
      }
      watchlists: {
        Row: {
          created_at: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_site_settings: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_site_settings: {
        Args: { settings_data: Json }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
