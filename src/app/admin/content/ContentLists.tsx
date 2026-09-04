import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Department, KnowledgeDocument, Service } from "./types";

export const ContentLists = ({
  departments,
  services,
  knowledgeDocuments,
}: {
  departments: Department[];
  services: Service[];
  knowledgeDocuments: KnowledgeDocument[];
}) => (
  <section className="grid gap-6 xl:grid-cols-3">
    <Card>
      <CardHeader>
        <CardTitle>Latest departments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {departments.map((department) => (
          <div key={department.id} className="rounded-lg border p-4">
            <p className="font-semibold">{department.name}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {department.description || "No description yet."}
            </p>
          </div>
        ))}
        {!departments.length ? (
          <Badge variant="outline">No departments</Badge>
        ) : null}
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Latest services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-lg border p-4">
            <p className="font-semibold">{service.title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {service.summary}
            </p>
          </div>
        ))}
        {!services.length ? <Badge variant="outline">No services</Badge> : null}
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Latest AI knowledge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {knowledgeDocuments.map((document) => (
          <div key={document.id} className="rounded-lg border p-4">
            <Badge variant="secondary" className="mb-2 capitalize">
              {document.source_type.replaceAll("_", " ")}
            </Badge>
            <p className="font-semibold">{document.title}</p>
            <p className="mt-1 line-clamp-3 text-sm text-slate-600">
              {document.content}
            </p>
          </div>
        ))}
        {!knowledgeDocuments.length ? (
          <Badge variant="outline">No AI knowledge</Badge>
        ) : null}
      </CardContent>
    </Card>
  </section>
);
