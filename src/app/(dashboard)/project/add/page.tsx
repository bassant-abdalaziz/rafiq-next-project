import { ProjectForm } from "@/components/dashboard/forms/project-form";
import { ProjectFormLayout } from "@/components/dashboard/ui/project-form-layout";

export default function AddProjectPage() {
  return (
    <ProjectFormLayout
      pageTitle="Add New Project"
      breadcrumbs={[
        { label: "Projects", href: "/project" },
        { label: "Add New Project" },
      ]}
      sectionTitle="Initialize New Project"
      sectionDescription="Define the scope and foundational details of your project."
    >
      <ProjectForm type="add" />
    </ProjectFormLayout>
  );
}