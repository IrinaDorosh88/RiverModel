const I18N_ENG = {
  // app
  'Sign out': 'Sign out',
  'Sign in': 'Sign in',
  'Sign up': 'Sign up',
  'Clean water is a healthy life.': 'Clean water is a healthy life.',
  'Explore the river flows with us!': 'Explore the river flows with us!',
  // confirmation-dialog
  'Are you sure?': 'Are you sure?',
  'Yes': 'Yes',
  'No': 'No',
  // authorization
  'SIGN UP': 'SIGN UP',
  'SIGN IN': 'SIGN IN',
  'Login': 'Login',
  'Password': 'Password',
  'Confirm': 'Confirm',
  'Sign in?': 'Sign in?',
  'Sign up?': 'Sign up?',
  'Submit': 'Submit',
  'Close': 'Close',
  'Login is required.': 'Login is required.',
  'Password is required.': 'Password is required.',
  'Confirm is required.': 'Confirm is required.',
  'Passwords do not match.': 'Passwords do not match.',
  'You are successfully signed up.': 'You are successfully signed up.',
  'You are successfully signed in': 'You are successfully signed in',
  'Invalid credentials.': 'Invalid credentials',
  'Something went wrong.': 'Something went wrong.',
  // home
  'River': 'River',
  'Substance': 'Substance',
  'Rivers & Substances': 'Rivers & Substances',
  'Map': 'Map',
  'Chart': 'Chart',
  // location-filter
  'Location': 'Location',
  // river-form
  'Name': 'Name',
  'Name is required.': 'Name is required.',
  'Edit $name river': (name: string) => `Edit ${name} river`,
  'New River': 'New River',
  '$name river is successfully created.': (name: string) => `${name} river is successfully created.`,
  '$name river is successfully edited.': (name: string) => `${name} river is successfully edited.`,
  // rivers
  'Delete $name river': (name: string) => `Delete ${name} river`,
  '$name river is successfully deleted.': (name: string) => `${name} river is successfully deleted.`,
  // substance-form
  'Min': 'Min',
  'Max': 'Max',
  'Unit': 'Unit',
  'Min must be a number.': 'Min must be a number.',
  'Min must be greater or equal to 0.': 'Min must be greater or equal to 0.',
  'Max must be a number.': 'Max must be a number.',
  'Min must be greater or equal to $value.': (value: string) => `Min must be greater or equal to ${value}.`,
  'Unit is required.': 'Unit is required.',
  'Edit $name substance': (name: string) => `Edit ${name} substance`,
  'New Substance': 'New Substance',
  '$name substance is successfully created.': (name: string) => `${name} substance is successfully created.`,
  '$name substance is successfully edited.': (name: string) => `${name} substance is successfully edited.`,
  // substances
  'Delete $name substance': (name: string) => `Delete ${name} substance`,
  '$name substance is successfully deleted.': (name: string) => `${name} river is successfully deleted.`,
  // location-form
  'Latitude': 'Latitude',
  'Longitude': 'Longitude',
  'Substances': 'Substances',
  'River is required.': 'River is required.',
  'Choose at least one substance.': 'Choose at least one substance.',
  'Edit $name location': (name: string) => `Edit ${name} location`,
  'New Location': 'New Location',
  '$name location is successfully created.': (name: string) => `${name} location is successfully created.`,
  '$name location is successfully edited.': (name: string) => `${name} location is successfully edited.`,
  // measurement-form
  'New Measurement': 'New Measurement',
  'Date': 'Date',
  'Measurement must be a number.': 'Measurement must be a number.',
  'Measurement must be greater or equal to 0.': 'Measurement must be greater or equal to 0.',
  'Measurement is successfully added.': 'Measurement is successfully added.',
  // map
  'Values': 'Values',
  'Choose location to display measurements.': 'Choose location to display Measurements.',
  '$name location is successfully deleted.': (name: string) => `${name} location is successfully deleted.`,
  'Delete $name location': (name: string) => `Delete ${name} location`,
  // chart
  'Choose location to display predictions.': 'Choose location to display data.',
  'days': 'days',
};

const I18N_UKR: typeof I18N_ENG = {
  // app
  'Sign out': 'Вийти',
  'Sign in': 'Увійти',
  'Sign up': 'Зареєструватися',
  'Clean water is a healthy life.': 'Чиста вода - здорове життя.',
  'Explore the river flows with us!': 'Досліджуй разом з нами річкові потоки!',
  // confirmation-dialog
  'Are you sure?': 'Ви впевнені?',
  'Yes': 'Так',
  'No': 'Ні',
  // authorization
  'SIGN UP': 'РЕЄСТРАЦІЯ',
  'SIGN IN': 'АВТОРИЗАЦІЯ',
  'Login': 'Логін',
  'Password': 'Пароль',
  'Confirm': 'Підтвердження паролю',
  'Sign in?': 'Увійти?',
  'Sign up?': 'Зареєструватися?',
  'Submit': 'Підтвердити',
  'Close': 'Закрити',
  'Login is required.': 'Логін обов\'язковий.',
  'Password is required.': 'Пароль обов\'язковий.',
  'Confirm is required.': 'Підтвердження паролю обов\'язкове.',
  'Passwords do not match.': 'Паролі не співпадають.',
  'You are successfully signed up.': 'Ви успішно зареєструвалися.',
  'You are successfully signed in': 'Ви успішно авторизувалися.',
  'Invalid credentials.': 'Щось пішло не так.',
  'Something went wrong.': 'Щось пішло не так.',
  // home
  'River': 'Річка',
  'Substance': 'Речовина',
  'Rivers & Substances': 'Річки & Речовини',
  'Map': 'Мапа',
  'Chart': 'Діаграма',
  // location-filter
  'Location': 'Локація',
  // river-form
  'Name': 'Назва',
  'Name is required.': 'Назва обов\'язкова.',
  'Edit $name river': (name: string) => `Редагування річки ${name}`,
  'New River': 'Створення річки',
  '$name river is successfully created.': (name: string) => `Річка ${name} успішно створена.`,
  '$name river is successfully edited.': (name: string) => `Річка ${name} успішно редагована.`,
  // rivers
  'Delete $name river': (name: string) => `Видалення річки ${name}`,
  '$name river is successfully deleted.': (name: string) => `Річка ${name} успішно видалена`,
  // substance-form
  'Min': 'Мін.',
  'Max': 'Макс.',
  'Unit': 'Одиниця виміру',
  'Min must be a number.': 'Мін. повинно бути числом.',
  'Min must be greater or equal to 0.': 'Мін. повинно бути більше рівне 0.',
  'Max must be a number.': 'Макс. повинно бути числом.',
  'Min must be greater or equal to $value.': (value: string) => `Макс. повинно бути більше рівне ${value}.`,
  'Unit is required.': 'Одиниця виміру обов\'язкова.',
  'Edit $name substance': (name: string) => `Редагування речовини ${name}`,
  'New Substance': 'Створення речовини',
  '$name substance is successfully created.': (name: string) => `Речовина ${name} успішно створена.`,
  '$name substance is successfully edited.': (name: string) => `Речовина ${name} успішно редагована.`,
  // substances
  'Delete $name substance': (name: string) => `Видалення речовини ${name}`,
  '$name substance is successfully deleted.': (name: string) => `Речовина ${name} успішно видалена.`,
  // location-form
  'Latitude': 'Широта',
  'Longitude': 'Довгота',
  'Substances': 'Речовини',
  'River is required.': 'Річка обов\'язкова.',
  'Choose at least one substance.': 'Оберіть принаймні одну речовину.',
  'Edit $name location': (name: string) => `Редагування локації ${name}`,
  'New Location': 'Створення локації',
  '$name location is successfully created.': (name: string) => `Локація ${name} успішно створена.`,
  '$name location is successfully edited.': (name: string) => `Локація ${name} успішно редагована.`,
  // measurement-form
  'New Measurement': 'Створення виміру',
  'Date': 'Дата',
  'Measurement must be a number.': 'Вимір повинен бути числом.',
  'Measurement must be greater or equal to 0.': 'Вимір повинен бути більший рівний 0',
  'Measurement is successfully added.': 'Вимір успішно додано.',
  // map
  'Values': 'Значення',
  'Choose location to display measurements.': 'Оберіть локацію для виведення вимірів.',
  'Delete $name location': (name: string) => `Видалення локації ${name}`,
  '$name location is successfully deleted.': (name: string) => `Локація ${name} успішно видалена.`,
  // chart
  'Choose location to display predictions.': 'Оберіть локацію для виведення передбачень.',
  'days': 'дні',
};

export const I18N = { ...I18N_UKR };

export function changeLanguage(code: 'eng' | 'ukr') {
  Object.entries(code === 'eng' ? I18N_ENG : I18N_UKR).forEach(
    ([key, value]) => {
      (I18N as any)[key] = value;
    }
  );
}