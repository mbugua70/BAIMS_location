import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    // We'll add tableSchemas here later
    tableSchema({
      name: 'forms',
      columns: [
        { name: 'form_id', type: 'string', isIndexed: true },
        {name: 'input_number', type: 'number'},
        {name: 'latitude', type: 'number'},
        {name: 'longitude', type: 'number'},
        { name: 'form_data', type: 'string' }, // Store dynamic fields as JSON string
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    })
  ]
})