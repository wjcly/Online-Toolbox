import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import OfficeViewer from '@/views/OfficeViewer.vue'
import WebScraper from '@/views/tools/WebScraper.vue'
import LinkChecker from '@/views/tools/LinkChecker.vue'
import ColorPicker from '@/views/tools/ColorPicker.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'
import Base64Converter from '@/views/tools/Base64Converter.vue'
import QrGenerator from '@/views/tools/QrGenerator.vue'
import PasswordManager from '@/views/tools/PasswordManager.vue'
import WatermarkRemover from '@/views/tools/WatermarkRemover.vue'
import FormatConverter from '@/views/tools/FormatConverter.vue'
import ResumeEditor from '@/views/resume/ResumeEditor.vue'
import WordCounter from '@/views/tools/WordCounter.vue'
import TextCipher from '@/views/tools/TextCipher.vue'
import UrlEncoder from '@/views/tools/UrlEncoder.vue'
import PasswordGenerator from '@/views/tools/PasswordGenerator.vue'
import TimestampConverter from '@/views/tools/TimestampConverter.vue'
import IPChecker from '@/views/tools/IPChecker.vue'
import HashGenerator from '@/views/tools/HashGenerator.vue'
import TextDiff from '@/views/tools/TextDiff.vue'
import RandomNumber from '@/views/tools/RandomNumber.vue'
import FullScreenClock from '@/views/tools/FullScreenClock.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/resume', name: 'resume', component: ResumeEditor },
  { path: '/tools/office-viewer', name: 'office-viewer', component: OfficeViewer },
  { path: '/tools/web-scraper', name: 'web-scraper', component: WebScraper },
  { path: '/tools/link-checker', name: 'link-checker', component: LinkChecker },
  { path: '/tools/color-picker', name: 'color-picker', component: ColorPicker },
  { path: '/tools/json-formatter', name: 'json-formatter', component: JsonFormatter },
  { path: '/tools/base64-converter', name: 'base64-converter', component: Base64Converter },
  { path: '/tools/qr-generator', name: 'qr-generator', component: QrGenerator },
  { path: '/tools/password-manager', name: 'password-manager', component: PasswordManager },
  { path: '/tools/watermark-remover', name: 'watermark-remover', component: WatermarkRemover },
  { path: '/tools/format-converter', name: 'format-converter', component: FormatConverter },
  { path: '/tools/word-counter', name: 'word-counter', component: WordCounter },
  { path: '/tools/text-cipher', name: 'text-cipher', component: TextCipher },
  { path: '/tools/url-encoder', name: 'url-encoder', component: UrlEncoder },
  { path: '/tools/password-generator', name: 'password-generator', component: PasswordGenerator },
  { path: '/tools/timestamp-converter', name: 'timestamp-converter', component: TimestampConverter },
  { path: '/tools/ip-checker', name: 'ip-checker', component: IPChecker },
  { path: '/tools/hash-generator', name: 'hash-generator', component: HashGenerator },
  { path: '/tools/text-diff', name: 'text-diff', component: TextDiff },
  { path: '/tools/random-number', name: 'random-number', component: RandomNumber },
  { path: '/tools/fullscreen-clock', name: 'fullscreen-clock', component: FullScreenClock },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
