export type Department = {
  id: string;
  name: string;
  description: string | null;
};

export type Service = {
  id: string;
  title: string;
  summary: string;
};

export type Doctor = {
  id: string;
  full_name: string;
  specialty: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  source_type: string;
  content: string;
};
