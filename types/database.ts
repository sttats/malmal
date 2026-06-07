export type VideoType = "normal" | "short";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          url: string;
          provider: string;
          video_id: string;
          title: string;
          description: string | null;
          thumbnail_url: string | null;
          video_type: VideoType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          url: string;
          provider: string;
          video_id: string;
          title: string;
          description?: string | null;
          thumbnail_url?: string | null;
          video_type: VideoType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          url?: string;
          provider?: string;
          video_id?: string;
          title?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          video_type?: VideoType;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type VideoRow = Database["public"]["Tables"]["videos"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];

export type ProfileSummary = {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export type VideoWithProfile = {
  id: string;
  userId: string;
  url: string;
  provider: string;
  videoId: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  videoType: VideoType;
  createdAt: string;
  updatedAt: string;
  profile: ProfileSummary;
};
