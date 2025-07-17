// src/components/TransportTypeLabel.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const cargoTransportTypes = {
  "0": "any_vehicle",
  "11": "tent",
  "21": "closed",
  "4": "isothermal",
  "19": "all_metal",
  "10": "refrigerator",
  "1": "bus",
  "29": "passenger_bus",
  "30": "luxury_bus",
  "17": "car_carrier",
  "23": "crane_truck",
  "39": "fuel_tanker",
  "50": "concrete_mixer",
  "42": "bitumen_tanker",
  "44": "flour_tanker",
  "7": "flatbed",
  "8": "open_truck",
  "41": "tow_truck",
  "43": "excavator",
  "3": "grain_truck",
  "58": "grain_dump",
  "54": "empty_container",
  "24": "container_truck",
  "53": "feed_truck",
  "5": "forest_truck",
  "57": "manipulator",
  "40": "oil_tanker",
  "36": "furniture_truck",
  "56": "metal_scrap_truck",
  "34": "minibus",
  "33": "oversized",
  "47": "panel_truck",
  "9": "platform",
  "52": "poultry_truck",
  "10": "refrigerator",
  "59": "roll_carrier",
  "22": "dump_truck",
  "48": "glass_truck",
  "38": "cattle_truck",
  "37": "special_vehicle",
  "31": "trawl",
  "35": "pipe_carrier",
  "28": "tractor",
  "32": "cement_truck",
  "49": "gas_tanker",
  "51": "isothermal_tanker",
  "2": "food_tanker",
  "14": "chemical_tanker",
  "20": "plastic_tank",
  "55": "chip_truck"
};

const vehicleTransportTypes = {
  "not_specified": "not_specified",
  "tent": "tent",
  "isotherm": "isothermal",
  "all_metal": "all_metal",
  "refrigerator": "refrigerator",
  "cargo_bus": "passenger_bus",
  "luxury_bus": "luxury_bus",
  "car_carrier": "car_carrier",
  "crane_truck": "crane_truck",
  "fuel_truck": "fuel_tanker",
  "concrete_mixer": "concrete_mixer",
  "bitumen_truck": "bitumen_tanker",
  "flour_truck": "flour_tanker",
  "flatbed": "flatbed",
  "open_platform": "open_truck",
  "tow_truck": "tow_truck",
  "excavator": "excavator",
  "grain_truck": "grain_truck",
  "grain_dump_truck": "grain_dump",
  "empty_container": "empty_container",
  "container_carrier": "container_truck",
  "feed_carrier": "feed_truck",
  "timber_truck": "forest_truck",
  "manipulator": "manipulator",
  "oil_truck": "oil_tanker",
  "furniture_truck": "furniture_truck",
  "metal_scrap_truck": "metal_scrap_truck",
  "minibus": "minibus",
  "oversized": "oversized",
  "panel_carrier": "panel_truck",
  "platform": "platform",
  "poultry_truck": "poultry_truck",
  "roll_carrier": "roll_carrier",
  "dump_truck": "dump_truck",
  "glass_carrier": "glass_truck",
  "cattle_truck": "cattle_truck",
  "special_vehicle": "special_vehicle",
  "lowboy_trailer": "trawl",
  "pipe_carrier": "pipe_carrier",
  "tractor": "tractor",
  "cement_truck": "cement_truck",
  "gas_tanker": "gas_tanker",
  "food_tanker": "food_tanker",
  "chemical_tanker": "chemical_tanker",
  "all_plastic": "plastic_tank",
  "wood_chip_truck": "chip_truck"
};

const TransportTypeLabel = ({ typeId, isCargo = false }) => {
  const { t } = useTranslation();

  const transportName = isCargo
    ? cargoTransportTypes[typeId]
    : vehicleTransportTypes[typeId];

  return (
    <span>
      {transportName ? t(transportName) : t('unknown')}
    </span>
  );
};

export default TransportTypeLabel;
