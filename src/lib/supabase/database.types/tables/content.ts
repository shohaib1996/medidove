import type { AppointmentStatus, Channel, Json, LeadStatus, UserRole } from "../shared";

export type ContentTables = {
  services: {
    Row: {
      id: string;
      department_id: string | null;
      title: string;
      slug: string;
      summary: string;
      description: string | null;
      image_url: string | null;
      is_active: boolean;
      created_at: string;
    };
    Insert: {
      id?: string;
      department_id?: string | null;
      title: string;
      slug: string;
      summary: string;
      description?: string | null;
      image_url?: string | null;
      is_active?: boolean;
      created_at?: string;
    };
    Update: {
      department_id?: string | null;
      title?: string;
      slug?: string;
      summary?: string;
      description?: string | null;
      image_url?: string | null;
      is_active?: boolean;
    };
    Relationships: [
      {
        foreignKeyName: "services_department_id_fkey";
        columns: ["department_id"];
        isOneToOne: false;
        referencedRelation: "departments";
        referencedColumns: ["id"];
      },
    ];
  };
  health_packages: {
    Row: {
      id: string;
      name: string;
      slug: string;
      description: string;
      price: number;
      duration: string | null;
      audience: string | null;
      features: string[];
      badge: string | null;
      image_url: string | null;
      is_featured: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      slug: string;
      description: string;
      price?: number;
      duration?: string | null;
      audience?: string | null;
      features?: string[];
      badge?: string | null;
      image_url?: string | null;
      is_featured?: boolean;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      slug?: string;
      description?: string;
      price?: number;
      duration?: string | null;
      audience?: string | null;
      features?: string[];
      badge?: string | null;
      image_url?: string | null;
      is_featured?: boolean;
      is_active?: boolean;
      updated_at?: string;
    };
    Relationships: [];
  };
  products: {
    Row: {
      id: string;
      name: string;
      slug: string;
      category: string;
      description: string;
      price: number;
      image_url: string | null;
      stock_status: string;
      requires_prescription: boolean;
      is_featured: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      name: string;
      slug: string;
      category?: string;
      description: string;
      price?: number;
      image_url?: string | null;
      stock_status?: string;
      requires_prescription?: boolean;
      is_featured?: boolean;
      is_active?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      name?: string;
      slug?: string;
      category?: string;
      description?: string;
      price?: number;
      image_url?: string | null;
      stock_status?: string;
      requires_prescription?: boolean;
      is_featured?: boolean;
      is_active?: boolean;
      updated_at?: string;
    };
    Relationships: [];
  };
  testimonials: {
    Row: {
      id: string;
      author_name: string;
      author_role: string | null;
      quote: string;
      rating: number;
      category: string;
      image_url: string | null;
      is_featured: boolean;
      is_published: boolean;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      author_name: string;
      author_role?: string | null;
      quote: string;
      rating?: number;
      category?: string;
      image_url?: string | null;
      is_featured?: boolean;
      is_published?: boolean;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      author_name?: string;
      author_role?: string | null;
      quote?: string;
      rating?: number;
      category?: string;
      image_url?: string | null;
      is_featured?: boolean;
      is_published?: boolean;
      updated_at?: string;
    };
    Relationships: [];
  };
  blog_posts: {
    Row: {
      id: string;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      category: string;
      image_url: string | null;
      author_name: string;
      is_published: boolean;
      published_at: string | null;
      created_by: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      id?: string;
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      category?: string;
      image_url?: string | null;
      author_name?: string;
      is_published?: boolean;
      published_at?: string | null;
      created_by?: string | null;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      image_url?: string | null;
      author_name?: string;
      is_published?: boolean;
      published_at?: string | null;
      created_by?: string | null;
      updated_at?: string;
    };
    Relationships: [
      {
        foreignKeyName: "blog_posts_created_by_fkey";
        columns: ["created_by"];
        isOneToOne: false;
        referencedRelation: "profiles";
        referencedColumns: ["id"];
      },
    ];
  };
};
