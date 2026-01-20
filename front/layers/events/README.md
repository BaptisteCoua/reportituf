# Events Layer - DateTime Define Demo

Layer de démonstration pour le module `datetime-define` montrant l'utilisation des 3 modes disponibles.

## Structure

```
layers/events/
├── composables/          # Composables utilisant datetime-define
│   ├── useBirthDatePicker.ts           # Mode 'date'
│   ├── useEventDateTimePicker.ts       # Mode 'datetime'
│   └── useAvailabilityRangePicker.ts   # Mode 'range'
├── components/
│   └── organisms/        # Composants de démonstration
│       ├── BirthDateDemo.vue
│       ├── EventDateTimeDemo.vue
│       └── AvailabilityRangeDemo.vue
├── pages/
│   └── events/
│       └── index.vue     # Page principale de démonstration
└── types/
    └── index.ts          # Types Event, Participant, Availability
```

## Modes démontrés

### Mode 'date'
Sélection de date simple (ex: date de naissance)
```typescript
export const useBirthDatePicker = defineDateTime('birth-date', {
    mode: 'date',
    format: 'dd/MM/yyyy',
    maxDate: new Date(),
    autoCorrect: true,
})
```

### Mode 'datetime'
Date + heure combinées (ex: rendez-vous)
```typescript
export const useEventDateTimePicker = defineDateTime('event-datetime', {
    mode: 'datetime',
    format: 'dd/MM/yyyy HH:mm',
    minDate: new Date(),
    timezone: 'Europe/Paris',
})
```

### Mode 'range'
Période entre deux dates (ex: disponibilité)
```typescript
export const useAvailabilityRangePicker = defineDateTime('availability-range', {
    mode: 'range',
    format: 'dd/MM/yyyy',
    minDate: new Date(),
})
```

## Utilisation

Accéder à la page de démonstration:
```
http://localhost:3000/events
```

Chaque composant montre:
- Les valeurs actuelles (date, datetime, range)
- La validation en temps réel
- Les formats ISO et formatés
- Des boutons pour tester les fonctionnalités

## Fonctionnalités démontrées

- ✅ Définition de dates avec différents modes
- ✅ Validation automatique (min/max dates)
- ✅ Formatage personnalisé
- ✅ Valeurs ISO
- ✅ AutoCorrect des dates invalides
- ✅ Registry global (instance partagée)
- ✅ API réactive (computed refs)

## Avantages du module datetime-define

1. **API unifiée** : Un seul `defineDateTime` au lieu de 3 fonctions séparées
2. **Types conditionnels** : L'API de retour s'adapte au mode
3. **Validation intégrée** : min/max dates, correction automatique
4. **Format flexible** : date-fns pour le formatage
5. **Registry** : Instances partagées entre composants
6. **Production-ready** : Tests complets, TypeScript strict
