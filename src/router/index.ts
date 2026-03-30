import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import OfficeViewer from '@/views/OfficeViewer.vue'
import ColorPicker from '@/views/tools/ColorPicker.vue'
import JsonFormatter from '@/views/tools/JsonFormatter.vue'
import Base64Converter from '@/views/tools/Base64Converter.vue'
import QrGenerator from '@/views/tools/QrGenerator.vue'
import PasswordManager from '@/views/tools/PasswordManager.vue'
import WatermarkRemover from '@/views/tools/WatermarkRemover.vue'
import FormatConverter from '@/views/tools/FormatConverter.vue'
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
import UuidGenerator from '@/views/tools/UuidGenerator.vue'
import LoremIpsum from '@/views/tools/LoremIpsum.vue'
import CaseConverter from '@/views/tools/CaseConverter.vue'
import UnitConverter from '@/views/tools/UnitConverter.vue'
import Pomodoro from '@/views/tools/Pomodoro.vue'
import PercentageCalc from '@/views/tools/PercentageCalc.vue'
import CurrencyConverter from '@/views/tools/CurrencyConverter.vue'
import QrScanner from '@/views/tools/QrScanner.vue'
import SkillTagGenerator from '@/views/tools/SkillTagGenerator.vue'
import AchievementQuantifier from '@/views/tools/AchievementQuantifier.vue'
import ContactFormatter from '@/views/tools/ContactFormatter.vue'
import DateFormatConverter from '@/views/tools/DateFormatConverter.vue'
import DiagramEditor from '@/views/tools/DiagramEditor.vue'
import IdPhotoMaker from '@/views/tools/IdPhotoMaker.vue'
import ClothingManager from '@/views/tools/ClothingManager.vue'
import BackgroundRemover from '@/views/tools/BackgroundRemover.vue'
import TtsGenerator from '@/views/tools/TtsGenerator.vue'
import RegexTester from '@/views/tools/RegexTester.vue'
import NicknameGenerator from '@/views/tools/NicknameGenerator.vue'
import CommentGenerator from '@/views/tools/CommentGenerator.vue'
import SlackingTool from '@/views/tools/SlackingTool.vue'
import OcrRecognizer from '@/views/tools/OcrRecognizer.vue'
import FaviconGenerator from '@/views/tools/FaviconGenerator.vue'
import SVGEditor from '@/views/tools/SVGEditor.vue'
import RandomTools from '@/views/tools/RandomTools.vue'
import MusicSearcher from '@/views/tools/MusicSearcher.vue'
import Calendar from '@/views/tools/Calendar.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/tools/office-viewer', name: 'office-viewer', component: OfficeViewer },
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
  { path: '/tools/uuid-generator', name: 'uuid-generator', component: UuidGenerator },
  { path: '/tools/lorem-ipsum', name: 'lorem-ipsum', component: LoremIpsum },
  { path: '/tools/case-converter', name: 'case-converter', component: CaseConverter },
  { path: '/tools/unit-converter', name: 'unit-converter', component: UnitConverter },
  { path: '/tools/pomodoro', name: 'pomodoro', component: Pomodoro },
  { path: '/tools/percentage-calc', name: 'percentage-calc', component: PercentageCalc },
  { path: '/tools/currency-converter', name: 'currency-converter', component: CurrencyConverter },
  { path: '/tools/qr-scanner', name: 'qr-scanner', component: QrScanner },
  { path: '/tools/skill-tag', name: 'skill-tag', component: SkillTagGenerator },
  { path: '/tools/achievement-quantifier', name: 'achievement-quantifier', component: AchievementQuantifier },
  { path: '/tools/contact-formatter', name: 'contact-formatter', component: ContactFormatter },
  { path: '/tools/date-format', name: 'date-format', component: DateFormatConverter },
  { path: '/tools/diagram-editor', name: 'diagram-editor', component: DiagramEditor },
  { path: '/tools/id-photo-maker', name: 'id-photo-maker', component: IdPhotoMaker },
  { path: '/tools/clothing-manager', name: 'clothing-manager', component: ClothingManager },
  { path: '/tools/background-remover', name: 'background-remover', component: BackgroundRemover },
  { path: '/tools/tts-generator', name: 'tts-generator', component: TtsGenerator },
  { path: '/tools/regex-tester', name: 'regex-tester', component: RegexTester },
  { path: '/tools/nickname-generator', name: 'nickname-generator', component: NicknameGenerator },
  { path: '/tools/comment-generator', name: 'comment-generator', component: CommentGenerator },
  { path: '/tools/slacking-tool', name: 'slacking-tool', component: SlackingTool },
  { path: '/tools/ocr-recognizer', name: 'ocr-recognizer', component: OcrRecognizer },
  { path: '/tools/favicon-generator', name: 'favicon-generator', component: FaviconGenerator },
  { path: '/tools/svg-editor', name: 'svg-editor', component: SVGEditor },
  { path: '/tools/random-tools', name: 'random-tools', component: RandomTools },
  { path: '/tools/music-searcher', name: 'music-searcher', component: MusicSearcher },
  { path: '/tools/calendar', name: 'calendar', component: Calendar },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
