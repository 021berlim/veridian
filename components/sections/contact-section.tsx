"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/layout/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { landingContent, projectTypes } from "@/data/site"
import { cn } from "@/lib/utils"

const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  company: z.string().min(1, "Informe o nome da empresa"),
  projectType: z.string().min(1, "Selecione o tipo de projeto"),
  message: z.string().min(10, "Descreva seu projeto com pelo menos 10 caracteres"),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      message: "",
    },
  })

  const projectType = watch("projectType")

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    console.log("Form submitted:", data)
    setSubmitted(true)
    reset()
  }

  return (
    <section id="contato" className="py-12 md:py-16">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight text-balance md:text-4xl lg:text-5xl">
              {landingContent.contact.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {landingContent.contact.description}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border/60 py-16 text-center">
                <CheckCircle2 className="mb-4 h-10 w-10 text-foreground/60" strokeWidth={1.25} />
                <p className="font-serif text-xl text-foreground">Mensagem enviada</p>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Obrigado pelo contato. Retornaremos em breve com uma análise personalizada.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Nome
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={cn(
                        "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0",
                        errors.name && "border-destructive",
                      )}
                      placeholder="Seu nome"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={cn(
                        "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0",
                        errors.email && "border-destructive",
                      )}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    {...register("company")}
                    className={cn(
                      "rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0",
                      errors.company && "border-destructive",
                    )}
                    placeholder="Nome da empresa"
                  />
                  {errors.company && (
                    <p className="text-xs text-destructive">{errors.company.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    Tipo de projeto
                  </Label>
                  <Select
                    value={projectType}
                    onValueChange={(value) =>
                      setValue("projectType", value, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "w-full rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus:ring-0",
                        errors.projectType && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectType && (
                    <p className="text-xs text-destructive">{errors.projectType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs uppercase tracking-[0.1em] text-muted-foreground">
                    Mensagem
                  </Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={4}
                    className={cn(
                      "resize-none rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:ring-0",
                      errors.message && "border-destructive",
                    )}
                    placeholder="Descreva seu projeto..."
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-foreground py-6 text-primary-foreground hover:bg-foreground/90 sm:w-auto sm:px-10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensagem"
                  )}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}