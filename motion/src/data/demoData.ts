export interface DemoRecord {
  id: string
  garage_name: string
  floor_level: string
  slot_bay: string
  zone_section: string
  vehicle_type: 'mobil' | 'motor'
  notes: string
  duration_text: string
  created_time: string
}

export const demoActiveRecord: DemoRecord = {
  id: 'demo-gi-b2-c14',
  garage_name: 'Grand Indonesia Mall',
  floor_level: 'B2',
  slot_bay: 'C-14',
  zone_section: 'Dekat Lobi Shinta (Pintu Barat)',
  vehicle_type: 'mobil',
  notes: 'Karcis parkir tersimpan di laci dashboard mobil',
  duration_text: '1j 24m',
  created_time: '19:40 WIB'
}
