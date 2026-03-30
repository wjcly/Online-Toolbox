/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue Router type declarations
import type { ComponentCustomProperties } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $router: Router
    $route: RouteLocationNormalizedLoaded
  }
}

declare module 'lunar-calendar' {
  interface LunarCalendarResult {
    zodiac: string
    GanZhiYear: string
    GanZhiMonth: string
    GanZhiDay: string
    worktime: number
    lunarYear: number
    lunarMonth: number
    lunarDay: number
    lunarMonthName: string
    lunarDayName: string
    lunarLeapMonth: number
    solarFestival: string
    lunarFestival: string
    term: string
  }

  interface SolarCalendarResult {
    year: number
    month: number
    day: number
  }

  const LunarCalendar: {
    calendar: (year: number, month: number, fill?: boolean) => {
      firstDay: number
      monthDays: number
      monthData: LunarCalendarResult[]
    }
    solarCalendar: (year: number, month: number, fill?: boolean) => {
      firstDay: number
      monthDays: number
      monthData: SolarCalendarResult[]
    }
    solarToLunar: (year: number, month: number, day: number) => LunarCalendarResult
    lunarToSolar: (year: number, month: number, day: number) => SolarCalendarResult
    setWorktime: (data: Record<string, Record<string, number>>) => void
  }

  export default LunarCalendar
}
