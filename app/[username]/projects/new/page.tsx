import { Metadata } from "next"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CreateProjectForm from "@/components/forms/create-project-form"

export const metadata: Metadata = {
  metadataBase: new URL(process?.env?.NEXT_PUBLIC_SITE_URL ?? "localhost:3000"),
  title: "Create new project",
  description: "Create a new project to start working on your next big idea!",
}

const NewProjectPage = () => {
  return (
    <Card className="mx-auto" style={{ width: "min(460px, 90vw)" }}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">New Project</CardTitle>
        <CardDescription>
          Create a new project to start working on your next big idea!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateProjectForm />
      </CardContent>
    </Card>
  )
}

export default NewProjectPage
