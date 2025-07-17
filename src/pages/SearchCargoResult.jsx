import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import CargoCard from '../components/CargoCard';

import styles from '../styles/SearchCargoResult.module.css';

import VehicleCard from '../components/vehicleCard';

import { search } from 'swiss-zipcodes';

import TabsBar from '../components/TabsBar';




function SearchCargoResult() {
    const { t } = useTranslation();
    const [cargos, setCargos] = useState([]);
    const location = useLocation();

    const [tabs, setTabs] = useState(() => {
        const saved = localStorage.getItem('tabs');
        return saved ? JSON.parse(saved) : [
            {
            id: 1,
            type: 'cargo',
            title: 'C Tab 1',
            searchMode: 'cargo',
            filters: {
                fromCountry: '',
                toCountry: '',
                fromDate: '',
                toDate: '',
                massFrom: '',
                massTo: '',
                volumeFrom: '',
                volumeTo: '',
                transportType: '',
                fromZip: '',
                toZip: '',
                cityFrom: '',
                cityTo: '',
                orderNumber: '', 
            },
            filteredCargos: [],
            filteredVehicles: [],
            }
        ];
    });

    const [activeTabId, setActiveTabId] = useState(() => {
        const savedId = localStorage.getItem('activeTabId');
        return savedId ? parseInt(savedId, 10) : 1;
    });

    // Сохраняем вкладки в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('tabs', JSON.stringify(tabs));
    }, [tabs]);

    // Сохраняем активную вкладку при изменении
    useEffect(() => {
        localStorage.setItem('activeTabId', activeTabId);
    }, [activeTabId]);


    const currentTab = tabs.find(tab => tab.id === activeTabId);
    const filters = currentTab.filters;
    const searchMode = currentTab.searchMode;



    const [openedDetailsCardId, setOpenedDetailsCardId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // если нужен сдвиг (shifted)

    // const [searchMode, setSearchMode] = useState('cargo'); // 'cargo' или 'transport'
    const [vehicles, setVehicles] = useState([]); // для транспорта



    const handleAddTab = () => {
        const newTab = {
            id: Date.now(),
            searchMode: 'cargo',
                title: `C Tab ${tabs.length + 1}`,
                filters: {
                    fromCountry: '',
                    toCountry: '',
                    fromDate: '',
                    toDate: '',
                    massFrom: '',
                    massTo: '',
                    volumeFrom: '',
                    volumeTo: '',
                    transportType: '',
                    fromZip: '',
                    toZip: '',
                    cityFrom: '',
                    cityTo: '',
                    orderNumber: '',
                    fromCountryState: '',
                    toCountryState: '',
                    fromDateState: '',
                    toDateState: '',
                    massFromState: '',
                    massToState: '',
                    volumeFromState: '',
                    volumeToState: '',
                    transportTypeState: '',
                },

            newCount: 0
        };

        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);

        // сброс фильтров
        setFromCountryState('');
        setToCountryState('');
        setFromDateState('');
        setToDateState('');
        setMassFromState('');
        setMassToState('');
        setVolumeFromState('');
        setVolumeToState('');
        setTransportTypeState('');
        setFromZip('');
        setToZip('');
        setcityFrom('');
        setcityTo('');
    };


    const handleCloseTab = (id) => {
        const newTabs = tabs.filter(tab => tab.id !== id);
        setTabs(newTabs);

        if (id === activeTabId && newTabs.length > 0) {
            setActiveTabId(newTabs[0].id);
        }
    };

    const handleTabClick = (id) => {
        setActiveTabId(id);
    };





    

    // Получение параметров из URL
    // Получение параметров из URL
    const queryParams = new URLSearchParams(location.search);

    const fromCountry = queryParams.get('fromCountry');
    const toCountry = queryParams.get('toCountry');
    const fromDate = queryParams.get('fromDate');
    const toDate = queryParams.get('toDate');
    const massFrom = queryParams.get('massFrom');
    const massTo = queryParams.get('massTo');
    const volumeFrom = queryParams.get('volumeFrom');
    const volumeTo = queryParams.get('volumeTo');
    const transportType = queryParams.get('transportType');
    const fromZipCode = queryParams.get('fromZip');
    const toZipCode = queryParams.get('toZip');
    const fromCity = queryParams.get('fromCity');
    const toCity = queryParams.get('toCity');
    
    useEffect(() => {
        if (filters.fromZip && filters.fromZip.length >= 4) {
            const result = search({ zip: parseInt(filters.fromZip) });
            if (result.length > 0) {
                const { commune, canton } = result[0];
                const updatedFilters = {
                    ...filters,
                    cityFrom: commune || '',
                    fromCountry: canton || ''
                };
                setTabs(prev =>
                    prev.map(tab =>
                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                    )
                );
            }
        }
    }, [filters.fromZip]);

      
    useEffect(() => {
        if (filters.toZip && filters.toZip.length >= 4) {
            const result = search({ zip: parseInt(filters.toZip) });
            if (result.length > 0) {
                const { commune, canton } = result[0];
                const updatedFilters = {
                    ...filters,
                    cityTo: commune || '',
                    toCountry: canton || ''
                };
                setTabs(prev =>
                    prev.map(tab =>
                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                    )
                );
            }
        }
    }, [filters.toZip]);

     

    const handleApplyFilter = () => {
        console.log("Фильтр применен");

        const fromCountryStr = filters.fromCountryState || '';
        const toCountryStr = filters.toCountryState || '';
        const fromDateState = filters.fromDateState || '';
        const toDateState = filters.toDateState || '';
        const massFromState = filters.massFromState || '';
        const massToState = filters.massToState || '';
        const volumeFromState = filters.volumeFromState || '';
        const volumeToState = filters.volumeToState || '';
        const transportTypeState = filters.transportTypeState || '';
        const fromZip = filters.fromZip || '';
        const toZip = filters.toZip || '';
        const cityFrom = filters.cityFrom || '';
        const cityTo = filters.cityTo || '';

        if (searchMode === 'cargo') {
            const token = localStorage.getItem('authToken');
                axios.get('http://127.0.0.1:8000/api/search-cargo/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                })

                .then(response => {
                    const allCargos = response.data;

                    const filteredCargos = allCargos.filter(cargo => {
                        const cargoFromZip = cargo.loading_postal_primary ? parseInt(cargo.loading_postal_primary) : null;
                        const cargoToZip = cargo.unloading_postal_primary ? parseInt(cargo.unloading_postal_primary) : null;
                        const cargoCityFrom = cargo.loading_city_primary?.toLowerCase();
                        const cargoCityTo = cargo.unloading_city_primary?.toLowerCase();

                        return (
                            (filters.orderNumber === '' || cargo.order_number === filters.orderNumber) &&

                            cargo.hidden !== true &&
                            
                            (fromCountryStr === "" || cargo.loading_canton === fromCountryStr) &&
                            (toCountryStr === "" || cargo.unloading_canton === toCountryStr) &&
                            (fromDateState === "" || new Date(cargo.date_from) >= new Date(fromDateState)) &&
                            (toDateState === "" || new Date(cargo.date_to) <= new Date(toDateState)) &&
                            (massFromState === "" || parseFloat(cargo.weight) >= parseFloat(massFromState)) &&
                            (massToState === "" || parseFloat(cargo.weight) <= parseFloat(massToState)) &&
                            (volumeFromState === "" || parseFloat(cargo.volume) >= parseFloat(volumeFromState)) &&
                            (volumeToState === "" || parseFloat(cargo.volume) <= parseFloat(volumeToState)) &&
                            (transportTypeState === "" || transportTypeState === "any" || cargo.transport_type === transportTypeState) &&
                            (fromZip === "" || cargoFromZip === parseInt(fromZip)) &&
                            (toZip === "" || cargoToZip === parseInt(toZip)) &&
                            (cityFrom === "" || cargoCityFrom?.trim().toLowerCase() === cityFrom.trim().toLowerCase()) &&
                            (cityTo === "" || cargoCityTo?.trim().toLowerCase() === cityTo.trim().toLowerCase())
                        );
                    });

                    console.log("Отфильтрованные грузы:", filteredCargos);

                    // Берем значение сортировки из фильтров (если пусто — берем 'createdAt_desc' по умолчанию)
                    const sortOption = filters.sortOption || 'createdAt_desc';

                    // Делаем копию массива и сортируем его по нужному полю
                    const sortedCargos = [...filteredCargos].sort((a, b) => {
                        switch (sortOption) {
                            case 'price_asc':
                                return a.price - b.price; // сортировка по цене вверх
                            case 'price_desc':
                                return b.price - a.price; // сортировка по цене вниз
                            case 'pickupDate_asc':
                                return new Date(a.date_from) - new Date(b.date_from); // дата отгрузки — ранние первыми
                            case 'pickupDate_desc':
                                return new Date(b.date_from) - new Date(a.date_from); // дата отгрузки — поздние первыми
                            case 'weight_asc':
                                return parseFloat(a.weight) - parseFloat(b.weight); // вес — по возрастанию
                            case 'weight_desc':
                                return parseFloat(b.weight) - parseFloat(a.weight); // вес — по убыванию
                            case 'createdAt_asc':
                                return new Date(a.created_at) - new Date(b.created_at); // новые первыми
                            case 'createdAt_desc':
                            default:
                                return new Date(b.created_at) - new Date(a.created_at); // старые первыми
                        }
                    });


                    setTabs(prevTabs =>
                        prevTabs.map(tab => {
                            if (tab.id === activeTabId) {
                                const numberPart = tab.title.match(/\d+/)?.[0] || '1';
                                const fromLabel = filters.cityFrom?.trim() || 'Everywhere';
                                const toLabel = filters.cityTo?.trim() || 'Everywhere';
                                const newTitle = `${fromLabel} <br/>→ ${toLabel}`;
                                return { ...tab, type: searchMode, title: newTitle };
                            }
                            return tab;
                        })
                    );


                    setTabs(prevTabs =>
                        prevTabs.map(tab =>
                            tab.id === activeTabId
                                ? { ...tab, filteredCargos: sortedCargos }
                                : tab
                        )
                    );
                })
                .catch(error => {
                    console.error("Ошибка при получении данных (cargo):", error);
                });
        } else {
            const token = localStorage.getItem("authToken");

            axios.get('http://127.0.0.1:8000/api/search-truck/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    const allTrucks = response.data;

                    console.log("ВСЕ машины:", allTrucks);

                    const filteredTrucks = allTrucks.filter(vehicle => {
                        const vehicleFromZip = vehicle.loading_postal ? parseInt(vehicle.loading_postal) : null;
                        const vehicleToZip = vehicle.unloading_postal ? parseInt(vehicle.unloading_postal) : null;
                        const vehicleCityFrom = vehicle.loading_city?.toLowerCase();
                        const vehicleCityTo = vehicle.unloading_city?.toLowerCase();

                        return (
                            (filters.orderNumber === '' || vehicle.order_number === filters.orderNumber) &&

                            (fromCountryStr === "" || vehicle.loading_canton?.toString() === fromCountryStr) &&
                            (toCountryStr === "" || vehicle.unloading_canton?.toString() === toCountryStr) &&
                            (fromDateState === "" || new Date(vehicle.loading_date_from) >= new Date(fromDateState)) &&
                            (toDateState === "" || new Date(vehicle.loading_date_to) <= new Date(toDateState)) &&
                            (massFromState === "" || parseFloat(vehicle.carrying_capacity) >= parseFloat(massFromState)) &&
                            (massToState === "" || parseFloat(vehicle.carrying_capacity) <= parseFloat(massToState)) &&
                            (volumeFromState === "" || parseFloat(vehicle.useful_volume) >= parseFloat(volumeFromState)) &&
                            (volumeToState === "" || parseFloat(vehicle.useful_volume) <= parseFloat(volumeToState)) &&
                            (transportTypeState === "" || transportTypeState === "any" || vehicle.transport_type === transportTypeState) &&
                            (fromZip === "" || vehicleFromZip === parseInt(fromZip)) &&
                            (toZip === "" || vehicleToZip === parseInt(toZip)) &&
                            (cityFrom === "" || vehicleCityFrom?.trim().toLowerCase() === cityFrom.trim().toLowerCase()) &&
                            (cityTo === "" || vehicleCityTo?.trim().toLowerCase() === cityTo.trim().toLowerCase())
                        );
                    });

                    const sortOption = filters.sortOption || 'createdAt_desc';

                    const sortedTrucks = [...filteredTrucks].sort((a, b) => {
                        switch (sortOption) {
                            case 'price_asc':
                                return a.price - b.price;
                            case 'price_desc':
                                return b.price - a.price;
                            case 'pickupDate_asc':
                                return new Date(a.loading_date_from) - new Date(b.loading_date_from);
                            case 'pickupDate_desc':
                                return new Date(b.loading_date_from) - new Date(a.loading_date_from);
                            case 'weight_asc':
                                return parseFloat(a.carrying_capacity) - parseFloat(b.carrying_capacity);
                            case 'weight_desc':
                                return parseFloat(b.carrying_capacity) - parseFloat(a.carrying_capacity);
                            case 'volume_asc':
                                return parseFloat(a.useful_volume) - parseFloat(b.useful_volume);
                            case 'volume_desc':
                                return parseFloat(b.useful_volume) - parseFloat(a.useful_volume);
                            case 'createdAt_asc':
                                return new Date(a.created_at) - new Date(b.created_at);
                            case 'createdAt_desc':
                            default:
                                return new Date(b.created_at) - new Date(a.created_at);
                        }
                    });


                    console.log("Отфильтрованные машины:", filteredTrucks);
                    setTabs(prevTabs =>
                        prevTabs.map(tab =>
                            tab.id === activeTabId
                                ? { ...tab, filteredVehicles: sortedTrucks }
                                : tab
                        )
                    );

                })
                .catch(error => {
                    console.error("Ошибка при получении данных (transport):", error);
                });
        }
    };
  
        
        // ✅ ВЫНЕСЕННЫЙ useEffect (вставь его сразу после handleApplyFilter):
        useEffect(() => {
            handleApplyFilter();
          }, [searchMode]); // можно просто [] если не хочешь обновление при смене режима
    
    
    return (
        <div>
            <TabsBar
                tabs={tabs}
                activeTabId={activeTabId}
                onTabClick={handleTabClick}
                onAddTab={handleAddTab}
                onCloseTab={handleCloseTab}
                onReorderTabs={(newTabs) => setTabs(newTabs)} // ← вот это добавили
            />


            <div className={`${styles['content-with-filter']} ${isDetailsOpen ? styles['shifted'] : ''}`}>


                <div style={{ display: 'flex', flexDirection: 'row' }}>

                <div className={styles.filterPanel}>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <button
                            onClick={() => {
                            setTabs(prev =>
                                prev.map(tab =>
                                    tab.id === activeTabId ? { ...tab, searchMode: 'cargo' } : tab
                                )
                            );

                            handleApplyFilter(); // мгновенный фильтр при переключении
                            }}
                            style={{
                            padding: '8px 12px',
                            backgroundColor: searchMode === 'cargo' ? '#007bff' : '#e0e0e0',
                            color: searchMode === 'cargo' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flex: 1
                            }}
                        >
                            {t("cargo")}
                        </button>
                        <button
                            onClick={() => {
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, searchMode: 'transport' } : tab
                                    )
                                );
                                handleApplyFilter(); // мгновенный фильтр при переключении
                            }}

                            style={{
                            padding: '8px 12px',
                            backgroundColor: searchMode === 'transport' ? '#28a745' : '#e0e0e0',
                            color: searchMode === 'transport' ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            flex: 1
                            }}
                        >
                            {t("transport")}
                        </button>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label>{t("search_by_order_number")}</label>
                        <input
                            type="text"
                            value={filters.orderNumber}
                            onChange={(e) => {
                            const updatedFilters = { ...filters, orderNumber: e.target.value };
                            setTabs(prev =>
                                prev.map(tab =>
                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                )
                            );
                            }}
                            placeholder="С/V..."
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label>{t("sort_by")}</label>
                        <select
                            value={filters.sortOption || 'createdAt_desc'}
                            onChange={(e) => {
                            const updatedFilters = { ...filters, sortOption: e.target.value };
                            setTabs(prev =>
                                prev.map(tab =>
                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                )
                            );
                            }}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="createdAt_desc">{t("newest_first")}</option>
                            <option value="createdAt_asc">{t("oldest_first")}</option>
                            <option value="price_asc">{t("cheapest_first")}</option>
                            <option value="price_desc">{t("expensive_first")}</option>
                            <option value="pickupDate_asc">{t("pickup_soonest")}</option>
                            <option value="pickupDate_desc">{t("pickup_latest")}</option>
                            <option value="weight_asc">{t("lightest_first")}</option>
                            <option value="weight_desc">{t("heaviest_first")}</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label>{t('loading_zip_code')}</label>
                        <input
                            type="text"
                            value={filters.fromZip}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, fromZip: e.target.value };
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                    )
                                );
                            }}
                        />

                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label>{t('unloading_zip_code')}</label>
                        <input
                            type="text"
                            value={filters.toZip}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, toZip: e.target.value };
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                    )
                                );
                            }}
                        />
                    </div>
                    
                    <div style={{ marginBottom: '8px' }}>
                        <label>{t('loading_city')}</label>
                        <input
                            type="text"
                            value={filters.cityFrom}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, cityFrom: e.target.value };
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                    )
                                );
                            }}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <label>{t('unloading_city')}</label>
                        <input
                            type="text"
                            value={filters.cityTo}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, cityTo: e.target.value };
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                    )
                                );
                            }}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>



                

                    <div className='loading_canton_find'>
                        <label>{t('loading_canton')}</label>
                        <select
                            value={filters.fromCountryState}
                            onChange={(e) => {
                                const updatedFilters = { ...filters, fromCountryState: e.target.value };
                                setTabs(prev =>
                                    prev.map(tab =>
                                        tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                    )
                                );
                            }}
                        >
                            <option value="">{t('select_canton')}</option>
                            <option value="ZH">{t('zurich')}</option>
                            <option value="BE">{t('bern')}</option>
                            <option value="LU">{t('lucerne')}</option>
                            <option value="UR">{t('uri')}</option>
                            <option value="SZ">{t('schwyz')}</option>
                            <option value="OW">{t('obwalden')}</option>
                            <option value="NW">{t('nidwalden')}</option>
                            <option value="GL">{t('glarus')}</option>
                            <option value="ZG">{t('zug')}</option>
                            <option value="FR">{t('fribourg')}</option>
                            <option value="SO">{t('solothurn')}</option>
                            <option value="BS">{t('basel_stadt')}</option>
                            <option value="BL">{t('basel_landschaft')}</option>
                            <option value="SH">{t('schaffhausen')}</option>
                            <option value="AR">{t('appenzell_ausserrhoden')}</option>
                            <option value="AI">{t('appenzell_innerrhoden')}</option>
                            <option value="SG">{t('st_gallen')}</option>
                            <option value="GR">{t('grisons')}</option>
                            <option value="AG">{t('aargau')}</option>
                            <option value="TG">{t('thurgau')}</option>
                            <option value="TI">{t('ticino')}</option>
                            <option value="VD">{t('vaud')}</option>
                            <option value="VS">{t('valais')}</option>
                            <option value="NE">{t('neuchatel')}</option>
                            <option value="GE">{t('geneva')}</option>
                            <option value="JU">{t('jura')}</option>

                            </select>
                        </div>

                        <div className='unloading_canton_find'>
                            <label>{t('unloading_canton')}</label>
                            <select
                                value={filters.toCountryState}
                                onChange={(e) => {
                                    const updatedFilters = { ...filters, toCountryState: e.target.value };
                                    setTabs(prev =>
                                        prev.map(tab =>
                                            tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                        )
                                    );
                                }}
                            >
                                
                                <option value="">{t('select_canton')}</option>
                                <option value="ZH">{t('zurich')}</option>
                                <option value="BE">{t('bern')}</option>
                                <option value="LU">{t('lucerne')}</option>
                                <option value="UR">{t('uri')}</option>
                                <option value="SZ">{t('schwyz')}</option>
                                <option value="OW">{t('obwalden')}</option>
                                <option value="NW">{t('nidwalden')}</option>
                                <option value="GL">{t('glarus')}</option>
                                <option value="ZG">{t('zug')}</option>
                                <option value="FR">{t('fribourg')}</option>
                                <option value="SO">{t('solothurn')}</option>
                                <option value="BS">{t('basel_stadt')}</option>
                                <option value="BL">{t('basel_landschaft')}</option>
                                <option value="SH">{t('schaffhausen')}</option>
                                <option value="AR">{t('appenzell_ausserrhoden')}</option>
                                <option value="AI">{t('appenzell_innerrhoden')}</option>
                                <option value="SG">{t('st_gallen')}</option>
                                <option value="GR">{t('grisons')}</option>
                                <option value="AG">{t('aargau')}</option>
                                <option value="TG">{t('thurgau')}</option>
                                <option value="TI">{t('ticino')}</option>
                                <option value="VD">{t('vaud')}</option>
                                <option value="VS">{t('valais')}</option>
                                <option value="NE">{t('neuchatel')}</option>
                                <option value="GE">{t('geneva')}</option>
                                <option value="JU">{t('jura')}</option>

                            </select>
                        </div>

                        

                        <div style={{ marginBottom: '8px' }}>
                            <label>{t('date')}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="date"
                                value={filters.fromDateState}
                                onChange={(e) => {
                                    const updatedFilters = { ...filters, fromDateState: e.target.value };
                                    setTabs(prev =>
                                        prev.map(tab =>
                                            tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                        )
                                    );
                                }}
                                style={{ flex: 1, padding: '4px', fontSize: '0.85rem' }}
                                placeholder="ДД.ММ.ГГГГ"
                            />

                            <input
                                type="date"
                                value={filters.toDateState}
                                onChange={(e) => {
                                    const updatedFilters = { ...filters, toDateState: e.target.value };
                                    setTabs(prev =>
                                        prev.map(tab =>
                                            tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                        )
                                    );
                                }}
                                style={{ flex: 1, padding: '4px', fontSize: '0.85rem' }}
                                placeholder="ДД.ММ.ГГГГ"
                            />


                            </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            <label>{t('weight')}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="number"
                                    value={filters.massFromState}
                                    onChange={(e) => {
                                        const updatedFilters = { ...filters, massFromState: e.target.value };
                                        setTabs(prev =>
                                            prev.map(tab =>
                                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                            )
                                        );
                                    }}
                                    placeholder={t('min_weight')}
                                    style={{ flex: 1, padding: '8px' }}
                                />

                            <input
                                    type="number"
                                    value={filters.massToState}
                                    onChange={(e) => {
                                        const updatedFilters = { ...filters, massToState: e.target.value };
                                        setTabs(prev =>
                                            prev.map(tab =>
                                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                            )
                                        );
                                    }}
                                    placeholder={t('max_weight')}
                                    style={{ flex: 1, padding: '8px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                            <label>{t('volume')}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="number"
                                    value={filters.volumeFromState}
                                    onChange={(e) => {
                                        const updatedFilters = { ...filters, volumeFromState: e.target.value };
                                        setTabs(prev =>
                                            prev.map(tab =>
                                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                            )
                                        );
                                    }}
                                    placeholder={t('min_volume')}
                                    style={{ flex: 1, padding: '8px' }}
                                />
                                <input
                                    type="number"
                                    value={filters.volumeToState}
                                    onChange={(e) => {
                                        const updatedFilters = { ...filters, volumeToState: e.target.value };
                                        setTabs(prev =>
                                            prev.map(tab =>
                                                tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                        )
                                        );
                                    }}
                                    placeholder={t('max_volume')}
                                    style={{ flex: 1, padding: '8px' }}
                                />
                            </div>
                        </div>

                        <div className='transport_type_find'>
                            <label>{t('transport_type')}</label>
                            <select
                                value={filters.transportTypeState}
                                onChange={(e) => {
                                    const updatedFilters = { ...filters, transportTypeState: e.target.value };
                                    setTabs(prev =>
                                        prev.map(tab =>
                                            tab.id === activeTabId ? { ...tab, filters: updatedFilters } : tab
                                        )
                                    );
                                }}
                            >
                                <option value="0">{t('any_vehicle')}</option>
                                <option value="1">{t('bus')}</option>
                                <option value="29">{t('passenger_bus')}</option>
                                <option value="30">{t('luxury_bus')}</option>
                                <option value="17">{t('car_carrier')}</option>
                                <option value="23">{t('crane_truck')}</option>
                                <option value="39">{t('fuel_tanker')}</option>
                                <option value="50">{t('concrete_mixer')}</option>
                                <option value="42">{t('bitumen_tanker')}</option>
                                <option value="44">{t('flour_tanker')}</option>
                                <option value="7">{t('flatbed')}</option>
                                <option value="8">{t('open_truck')}</option>
                                <option value="41">{t('tow_truck')}</option>
                                <option value="43">{t('excavator')}</option>
                                <option value="3">{t('grain_truck')}</option>
                                <option value="58">{t('grain_dump')}</option>
                                <option value="4">{t('isothermal')}</option>
                                <option value="54">{t('empty_container')}</option>
                                <option value="24">{t('container_truck')}</option>
                                <option value="53">{t('feed_truck')}</option>
                                <option value="21">{t('closed')}</option>
                                <option value="5">{t('forest_truck')}</option>
                                <option value="57">{t('manipulator')}</option>
                                <option value="40">{t('oil_tanker')}</option>
                                <option value="36">{t('furniture_truck')}</option>
                                <option value="56">{t('metal_scrap_truck')}</option>
                                <option value="34">{t('minibus')}</option>
                                <option value="33">{t('oversized')}</option>
                                <option value="47">{t('panel_truck')}</option>
                                <option value="9">{t('platform')}</option>
                                <option value="52">{t('poultry_truck')}</option>
                                <option value="10">{t('refrigerator')}</option>
                                <option value="59">{t('roll_carrier')}</option>
                                <option value="22">{t('dump_truck')}</option>
                                <option value="48">{t('glass_truck')}</option>
                                <option value="38">{t('cattle_truck')}</option>
                                <option value="37">{t('special_vehicle')}</option>
                                <option value="11">{t('tent')}</option>
                                <option value="31">{t('trawl')}</option>
                                <option value="35">{t('pipe_carrier')}</option>
                                <option value="28">{t('tractor')}</option>
                                <option value="32">{t('cement_truck')}</option>
                                <option value="49">{t('gas_tanker')}</option>
                                <option value="51">{t('isothermal_tanker')}</option>
                                <option value="2">{t('food_tanker')}</option>
                                <option value="14">{t('chemical_tanker')}</option>
                                <option value="19">{t('all_metal')}.</option>
                                <option value="20">{t('plastic_tank')}</option>
                                <option value="55">{t('chip_truck')}</option>
                            </select>
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginTop: '20px' }}>
                            <button 
                                onClick={() => handleApplyFilter()} 
                                style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 }}>
                                {t("apply")}
                            </button>
                            
                        </div>
                    </div>

                    {/* 👉 Правый блок — КАРТОЧКИ */}
                    <div style={{ flex: 1 }}>
                        {searchMode === 'cargo' ? (
                            currentTab?.filteredCargos?.length > 0
                                ? currentTab.filteredCargos.map(cargo => (
                                    <CargoCard
                                    key={cargo.id}
                                    cargo={cargo}
                                    openedDetailsCardId={openedDetailsCardId}
                                    setOpenedDetailsCardId={setOpenedDetailsCardId}
                                    setIsDetailsOpen={setIsDetailsOpen}
                                    />
                                ))
                                : <p>{t("no_cargos_found")}</p>
                            ) : (
                            currentTab?.filteredVehicles?.length > 0
                                ? currentTab.filteredVehicles.map(vehicle => (
                                    <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                    openedDetailsCardId={openedDetailsCardId}
                                    setOpenedDetailsCardId={setOpenedDetailsCardId}
                                    setIsDetailsOpen={setIsDetailsOpen}
                                    />
                                ))
                                : <p>{t("no_vehicles_found")}</p>
                            )}
                    </div>
                </div>
            </div>
            <footer className="bg-white border-top py-4 mt-5">
                <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <p className="mb-0 text-muted">{t("footer_text")}</p>
                    <div className="footer-links">
                        <Link to="/services">{t("services")}</Link>
                        <Link to="/contacts">{t("contacts")}</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default SearchCargoResult;
