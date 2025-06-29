"use client"

// Category selector component
import { memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RELATIONSHIP_CATEGORIES } from "@/lib/config"

interface CategorySelectorProps {
  onSelectCategory: (categoryId: string) => void
  selectedCategory?: string
}

export const CategorySelector = memo(function CategorySelector({
  onSelectCategory,
  selectedCategory,
}: CategorySelectorProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">What would you like advice about?</CardTitle>
        <CardDescription>Choose a category to get more targeted relationship advice from Kent J.</CardDescription>
      </CardHeader>
      <CardContent className="text-wrap p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {RELATIONSHIP_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-start text-wrap justify-left space-y-2 "
              onClick={() => onSelectCategory(category.id)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{category.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
