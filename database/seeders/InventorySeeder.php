<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\InventoryItem;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $medicines = [
            'Paracetamol 500mg', 'Amoxicillin 500mg', 'Ibuprofen 200mg', 'Metformin 500mg',
            'Losartan 50mg', 'Amlodipine 5mg', 'Cetirizine 10mg', 'Omeprazole 20mg',
            'Mefenamic Acid 500mg', 'Salbutamol 2mg', 'Loperamide 2mg', 'Doxycycline 100mg',
            'Ciprofloxacin 500mg', 'Metronidazole 500mg', 'Clopidogrel 75mg', 'Atorvastatin 20mg',
            'Ranitidine 150mg', 'Captopril 25mg', 'Glimepiride 2mg', 'Diclofenac 50mg',
            'Tramadol 50mg', 'Co-Amoxiclav 625mg', 'Azithromycin 500mg', 'Clindamycin 300mg',
            'Prednisone 5mg', 'Dexamethasone 4mg', 'Vitamin C 500mg', 'Vitamin B Complex',
            'Ferrous Sulfate 325mg', 'Folic Acid 5mg', 'Multivitamins', 'Calcium Carbonate 500mg',
            'Zinc Sulfate 20mg', 'ORS Powder', 'Cough Syrup (Dextromethorphan)', 'Antacid Suspension',
            'Mupirocin Ointment', 'Hydrocortisone Cream 1%', 'Betadine Solution', 'Silver Sulfadiazine Cream',
        ];

        $supplies = [
            'Disposable Gloves (Latex)', 'Disposable Gloves (Nitrile)', 'Surgical Masks',
            'N95 Masks', 'Cotton Balls', 'Gauze Pads 4x4', 'Adhesive Bandage (Band-Aid)',
            'Elastic Bandage 3"', 'Medical Tape', 'Alcohol 70% (500ml)', 'Hydrogen Peroxide 3%',
            'Syringes 3ml', 'Syringes 5ml', 'Syringes 10ml', 'IV Cannula 22G', 'IV Set',
            'Tongue Depressor', 'Cotton Swab (Applicator)', 'Urine Cup', 'Specimen Container',
            'Surgical Suture (Nylon)', 'Catheter (Foley 16F)', 'Oxygen Mask', 'Nebulizer Mask',
            'Blood Collection Tube (EDTA)', 'Blood Collection Tube (Clot)', 'Lancet',
            'Glucometer Strips', 'Pregnancy Test Kit', 'Drug Test Kit',
        ];

        $equipment = [
            'Digital Thermometer', 'Stethoscope', 'Blood Pressure Monitor (Digital)',
            'Pulse Oximeter', 'Nebulizer Machine', 'Glucometer', 'Weighing Scale',
            'Height Measuring Rod', 'Examination Light', 'Mayo Stand',
            'Instrument Tray', 'Kidney Basin', 'Scissors (Bandage)', 'Forceps (Hemostatic)',
            'Suture Removal Kit', 'Minor Surgery Kit', 'Otoscope', 'Ophthalmoscope',
            'Reflex Hammer', 'Penlight', 'Wheelchair', 'Crutches (pair)',
            'Hot/Cold Compress', 'Ice Bag', 'Tourniquet', 'Splint Set',
            'Cervical Collar', 'Emergency Bag', 'First Aid Kit', 'Sharps Container',
        ];

        $suppliers = ['PhilPharma Inc.', 'MedSupply Co.', 'UniDrug Corp.', 'HealthFirst Distributors', 'Pacific Medical', 'Metro Drug Inc.', null];

        $units = [
            'medicine' => ['tablets', 'capsules', 'bottles', 'vials', 'packs'],
            'supply' => ['pcs', 'boxes', 'packs', 'rolls', 'bottles'],
            'equipment' => ['pcs', 'sets', 'pcs', 'pcs', 'pcs'],
        ];

        $items = [];

        // 40 medicines
        foreach ($medicines as $i => $name) {
            $items[] = [
                'name' => $name,
                'category' => 'medicine',
                'description' => 'Medical pharmaceutical product',
                'unit' => $units['medicine'][array_rand($units['medicine'])],
                'quantity' => rand(0, 500),
                'minimum_stock' => rand(20, 50),
                'unit_price' => rand(5, 150) + (rand(0, 99) / 100),
                'expiration_date' => now()->addDays(rand(-30, 365))->format('Y-m-d'),
                'supplier' => $suppliers[array_rand($suppliers)],
                'batch_number' => 'B' . str_pad((string) rand(1000, 9999), 4, '0') . '-' . rand(2025, 2026),
                'status' => rand(1, 10) > 1 ? 'active' : 'discontinued',
            ];
        }

        // 30 supplies
        foreach ($supplies as $name) {
            $items[] = [
                'name' => $name,
                'category' => 'supply',
                'description' => 'Medical supply item',
                'unit' => $units['supply'][array_rand($units['supply'])],
                'quantity' => rand(0, 1000),
                'minimum_stock' => rand(30, 100),
                'unit_price' => rand(2, 80) + (rand(0, 99) / 100),
                'expiration_date' => rand(1, 3) === 1 ? now()->addDays(rand(-15, 180))->format('Y-m-d') : null,
                'supplier' => $suppliers[array_rand($suppliers)],
                'batch_number' => 'S' . str_pad((string) rand(1000, 9999), 4, '0'),
                'status' => 'active',
            ];
        }

        // 30 equipment
        foreach ($equipment as $name) {
            $items[] = [
                'name' => $name,
                'category' => 'equipment',
                'description' => 'Medical equipment/device',
                'unit' => $units['equipment'][array_rand($units['equipment'])],
                'quantity' => rand(1, 20),
                'minimum_stock' => rand(2, 5),
                'unit_price' => rand(50, 5000) + (rand(0, 99) / 100),
                'expiration_date' => null,
                'supplier' => $suppliers[array_rand($suppliers)],
                'batch_number' => 'E' . str_pad((string) rand(100, 999), 3, '0'),
                'status' => 'active',
            ];
        }

        foreach ($items as $item) {
            InventoryItem::create($item);
        }
    }
}
