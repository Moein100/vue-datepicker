# Vue Multi-Calendar Datepicker

A comprehensive, feature-rich Vue 3 datepicker component with support for Jalali (Persian), Gregorian, Hijri, and Chinese calendars. **Headless architecture** with custom font support and an incredibly lightweight bundle!

[![npm version](https://img.shields.io/npm/v/@mahlaparvaz/vue-datepicker.svg)](https://www.npmjs.com/package/@mahlaparvaz/vue-datepicker)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@mahlaparvaz/vue-datepicker)](https://bundlephobia.com/package/@mahlaparvaz/vue-datepicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# @mahlaparvaz/vue-datepicker

A **lightweight, fully customizable headless datepicker for Vue 3** with support for multiple calendars, time picking, range selection, and advanced formatting.

---

## 🚀 Features

* **Headless Architecture:** Complete control over UI with scoped slots.
* **Multiple Selection Modes:** `single`, `range`, `multiple`.
* **Time Picker:** Optional 12/24-hour time selection.
* **Customizable Output:** Object, timestamp, unix, ISO string, or custom formatter.
* **Custom Fonts:** Set fonts per calendar type with `fontConfig`.
* **Themes & Dark Mode:** Use CSS variables or `theme` prop.
* **Internationalization:** Supports Jalali (`fa`), Gregorian (`en`), Hijri (`ar`), Chinese (`zh`).
* **Locale Switching:** Built-in selector or programmatic via `v-model:locale`.
* **Date Constraints:** Limit selectable years/dates (`yearsBefore`, `yearsAfter`, `minDate`, `maxDate`).
* **Validation & Parsing:** Built-in utilities for Jalali, Gregorian, and Hijri calendars.
* **Responsive & Accessible:** Mobile-friendly, keyboard navigation, ARIA labels, high contrast mode.
* **SSR Safe:** Auto style injection works with server-side rendering.
* **Lightweight:** ~24KB gzipped.

---

## 📦 Installation

```bash
npm install @mahlaparvaz/vue-datepicker
# or
yarn add @mahlaparvaz/vue-datepicker
```

---

## ⚡ Usage

### Basic Single Date

```vue
<script setup>
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';
import { ref } from 'vue';

const date = ref(null);
</script>

<template>
  <DatepickerHeadless v-model="date">
    <template #default="{ open, formattedDate }">
      <input :value="formattedDate" @click="open" placeholder="Select date" />
    </template>
  </DatepickerHeadless>
</template>
```

### Range Selection

```vue
<DatepickerHeadless mode="range" v-model="rangeDate">
  <template #default="{ open, formattedDate }">
    <input :value="formattedDate" @click="open" placeholder="Select range" />
  </template>
</DatepickerHeadless>
```

### Multiple Dates

```vue
<DatepickerHeadless mode="multiple" v-model="dates">
  <template #default="{ open, formattedDate }">
    <input :value="formattedDate" @click="open" placeholder="Select multiple dates" />
  </template>
</DatepickerHeadless>
```

### Time Picker

```vue
<DatepickerHeadless :enable-time="true" :time-format="24" v-model="dateTime">
  <template #default="{ open, formattedDate }">
    <input :value="formattedDate" @click="open" placeholder="Select date & time" />
  </template>
</DatepickerHeadless>
```

---

## 🎨 Customization

* **Fonts:**

```vue
<DatepickerHeadless :font-config="{ jalali: 'Vazir', gregorian: 'Roboto' }"></DatepickerHeadless>
```

* **Themes:**

```vue
<DatepickerHeadless :theme="{ colors: { primary: '#e91e63' } }"></DatepickerHeadless>
```

* **CSS Variables:** Global styling with `--datepicker-*` variables.

---

## 🌐 Internationalization

```vue
<DatepickerHeadless locale="fa" v-model="date">
  <template #default="{ open, formattedDate }">
    <input :value="formattedDate" @click="open" placeholder="انتخاب تاریخ" />
  </template>
</DatepickerHeadless>
```

* `fa` - Jalali
* `en` - Gregorian
* `ar` - Hijri
* `zh` - Chinese

---

## 🔧 Props

| Prop                 | Type                                | Default        | Description                                                                  |
| -------------------- | ----------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `modelValue`         | `Object`                            | `null`         | Selected date(s)                                                             |
| `mode`               | `'single' \| 'range' \| 'multiple'` | `'single'`     | Selection mode                                                               |
| `locale`             | `String`                            | `null`         | Calendar locale                                                              |
| `placeholder`        | `String`                            | Auto           | Input placeholder                                                            |
| `format`             | `String`                            | `'YYYY/MM/DD'` | Input display format                                                         |
| `fontConfig`         | `Object`                            | `null`         | Custom fonts per calendar type                                               |
| `theme`              | `Object`                            | `null`         | Theme styling                                                                |
| `enableTime`         | `Boolean`                           | `false`        | Enable time selection                                                        |
| `timeFormat`         | `Number \| String`                  | `24`           | 12 or 24 hour                                                                |
| `yearsBefore`        | `Number`                            | `50`           | Years before current                                                         |
| `yearsAfter`         | `Number`                            | `50`           | Years after current                                                          |
| `minDate`            | `Date \| String`                    | `null`         | Minimum selectable date                                                      |
| `maxDate`            | `Date \| String`                    | `null`         | Maximum selectable date                                                      |
| `outputFormat`       | `String \| Function`                | `'object'`     | `'object'`, `'timestamp'`, `'unix'`, `'iso'`, `'string'`, or custom function |
| `outputStringFormat` | `String`                            | `'YYYY/MM/DD'` | Used when `outputFormat="string"`                                            |

---

## 🛠 Events

| Event               | Payload  | Description                 |
| ------------------- | -------- | --------------------------- |
| `update:modelValue` | `Object` | Emits when date changes     |
| `update:locale`     | `String` | Emits when locale changes   |
| `change`            | `Object` | Emitted on date change      |
| `confirm`           | `Object` | Emitted when date confirmed |
| `open`              | -        | Picker opens                |
| `close`             | -        | Picker closes               |

---

## ✅ Validation & Utilities

```javascript
import {
  isValidJalaaliDate,
  isValidGregorianDate,
  isValidDate,
  parseDate,
} from '@mahlaparvaz/vue-datepicker';

isValidJalaaliDate(1403, 9, 15); // true
isValidGregorianDate(2024, 2, 29); // true
parseDate('1403/09/15');
```

---

## 📱 Responsive & Accessibility

* Mobile-first responsive overlay
* Keyboard navigation
* ARIA support
* High contrast support

---

## 🔗 Getting Started Example

```vue
<script setup>
import { ref } from 'vue';
import DatepickerHeadless from '@mahlaparvaz/vue-datepicker';

const rangeDate = ref({ start: null, end: null });
const currentLocale = ref('fa');
const darkTheme = {
  colors: { primary: '#84b3fe', grayLighter: '#1e1e1e', textPrimary: '#fff' }
};
</script>

<template>
  <DatepickerHeadless
    mode="range"
    v-model="rangeDate"
    v-model:locale="currentLocale"
    :enable-time="true"
    :theme="darkTheme"
    :font-config="{ jalali: 'Vazir', gregorian: 'Roboto' }"
  >
    <template #default="{ open, formattedDate, fontFamily }">
      <input :value="formattedDate" :style="{ fontFamily }" @click="open" placeholder="Select range with time" />
    </template>
  </DatepickerHeadless>
</template>
```

---

## 📄 License

MIT © Mahla Zohourparvaz

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

* 📧 Email: [mahla.zph@gmail.com](mailto:mahla.zph@gmail.com)
* 🐛 Issues: [GitHub Issues](https://github.com/MahlaParvaz/vue-datepicker/issues)

---

Made with ❤️ for the Vue community
