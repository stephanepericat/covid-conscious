<template>
  <div class="relative w-full max-w-md search-container">
    <!-- Search Input -->
    <div class="relative">
      <Input
        v-model="searchQuery"
        placeholder="Search..."
        class="w-full h-10 pl-10"
      />
      <SearchIcon
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
      />
      <Button
        v-if="searchQuery"
        variant="ghost"
        size="icon"
        class="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
        @click="clearSearch"
      >
        <XIcon class="h-4 w-4" />
      </Button>
    </div>

    <!-- Results Dropdown - Fixed width, positioned absolutely -->
    <div
      v-if="searchQuery && showResults"
      class="absolute z-50 left-0 mt-1 w-[380px] max-w-[95vw] bg-background rounded-md border shadow-md overflow-hidden"
      :style="{ minWidth: inputWidth + 'px' }"
    >
      <div class="p-2 flex items-center justify-between border-b">
        <span class="text-sm font-medium text-muted-foreground"
          >{{ totalResults }} results</span
        >
      </div>

      <!-- No results state -->
      <div v-if="filteredResults.length === 0" class="p-4 text-center">
        <SearchXIcon class="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p class="text-sm text-muted-foreground">
          No results found for "{{ searchQuery }}"
        </p>
      </div>

      <!-- Results by category -->
      <div v-else>
        <div v-for="(category, index) in categories" :key="index" class="py-2">
          <div v-if="getResultsByCategory(category).length > 0">
            <div
              class="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase"
            >
              {{ formatCategory(category) }}
            </div>

            <div
              v-for="(result, resultIndex) in getResultsByCategory(category)"
              :key="resultIndex"
              class="px-4 py-2 hover:bg-accent cursor-pointer"
              @click="selectResult(result)"
            >
              <div class="flex items-start">
                <!-- Category-specific icon -->
                <div class="mr-3 mt-0.5">
                  <FileTextIcon
                    v-if="category === 'news'"
                    class="w-4 h-4 text-primary"
                  />
                  <BookOpenIcon
                    v-else-if="category === 'scientific papers'"
                    class="w-4 h-4 text-emerald-500"
                  />
                  <AlertCircleIcon
                    v-else-if="category === 'public health watch'"
                    class="w-4 h-4 text-amber-500"
                  />
                  <VideoIcon
                    v-else-if="category === 'videos'"
                    class="w-4 h-4 text-rose-500"
                  />
                </div>

                <!-- Result content -->
                <div class="flex-1">
                  <div
                    class="text-sm font-medium"
                    v-html="highlightMatch(result.title)"
                  ></div>
                  <div
                    class="text-xs text-muted-foreground mt-1"
                    v-html="highlightMatch(result.description)"
                  ></div>
                  <div class="flex items-center mt-1">
                    <CalendarIcon class="w-3 h-3 text-muted-foreground mr-1" />
                    <span class="text-xs text-muted-foreground">{{
                      result.date
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View all results -->
        <div class="p-2 border-t">
          <Button
            variant="ghost"
            @click="viewAllResults"
            class="w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
          >
            View all results
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Search as SearchIcon,
  X as XIcon,
  FileText as FileTextIcon,
  BookOpen as BookOpenIcon,
  AlertCircle as AlertCircleIcon,
  Video as VideoIcon,
  Calendar as CalendarIcon,
  SearchX as SearchXIcon,
} from 'lucide-vue-next'

// Import shadcn-vue components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Mock data - in a real app, this would come from an API
const mockData = [
  {
    id: 1,
    title: 'COVID-19 Updates',
    description: 'Latest updates on COVID-19 pandemic',
    category: 'news',
    date: '2023-05-15',
  },
  {
    id: 2,
    title: 'Vaccine Efficacy Study',
    description: 'New research on vaccine efficacy against variants',
    category: 'scientific papers',
    date: '2023-04-22',
  },
  {
    id: 3,
    title: 'Global Health Alert',
    description: 'WHO issues new global health alert',
    category: 'public health watch',
    date: '2023-05-10',
  },
  {
    id: 4,
    title: 'Understanding mRNA Technology',
    description: 'Educational video on mRNA vaccine technology',
    category: 'videos',
    date: '2023-03-18',
  },
  {
    id: 5,
    title: 'New Variant Discovered',
    description: 'Scientists discover new COVID variant',
    category: 'news',
    date: '2023-05-12',
  },
  {
    id: 6,
    title: 'Pandemic Response Analysis',
    description: 'Academic paper analyzing pandemic responses globally',
    category: 'scientific papers',
    date: '2023-04-05',
  },
  {
    id: 7,
    title: 'Health System Preparedness',
    description: 'Report on health system preparedness for future outbreaks',
    category: 'public health watch',
    date: '2023-05-01',
  },
  {
    id: 8,
    title: 'Expert Interview: Future of Vaccines',
    description: 'Interview with leading vaccine researchers',
    category: 'videos',
    date: '2023-04-28',
  },
]

const searchQuery = ref('')
const showResults = ref(false)
const categories = [
  'news',
  'scientific papers',
  'public health watch',
  'videos',
]
const inputWidth = ref(0)

// Format category name for display
const formatCategory = (category) => {
  return category
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Filter results based on search query
const filteredResults = computed(() => {
  if (!searchQuery.value) return []

  const query = searchQuery.value.toLowerCase()
  return mockData.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query),
  )
})

// Get total number of results
const totalResults = computed(() => filteredResults.value.length)

// Get results by category
const getResultsByCategory = (category) => {
  return filteredResults.value.filter((item) => item.category === category)
}

// Highlight matching text
const highlightMatch = (text) => {
  if (!searchQuery.value) return text

  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(
    regex,
    '<span class="bg-yellow-100 font-medium">$1</span>',
  )
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Select a result
const selectResult = (result) => {
  console.log('Selected result:', result)
  // In a real app, you would navigate to the result page
  showResults.value = false
}

// View all results
const viewAllResults = () => {
  console.log('View all results for:', searchQuery.value)
  // In a real app, you would navigate to a search results page
}

// Handle click outside to close results
let debounceTimeout
const handleClickOutside = (event) => {
  const searchElement = document.querySelector('.search-container')
  if (searchElement && !searchElement.contains(event.target)) {
    showResults.value = false
  }
}

// Get input width for minimum dropdown width
const updateInputWidth = () => {
  nextTick(() => {
    const inputElement = document.querySelector('.search-container input')
    if (inputElement) {
      inputWidth.value = inputElement.offsetWidth
    }
  })
}

// Show results when typing
watch(searchQuery, (newValue) => {
  showResults.value = newValue.length > 0

  // Debounce for API calls
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    // In a real app, this is where you would call the search API
    console.log('Searching for:', searchQuery.value)
  }, 300)
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  updateInputWidth()
  window.addEventListener('resize', updateInputWidth)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateInputWidth)
})
</script>

<style scoped>
:deep(.bg-yellow-100) {
  background-color: rgba(254, 240, 138, 0.5);
}
</style>
