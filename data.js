const cityTypes = [
    {
        id: 1,
        city: 'London',
        categories: [
            {
                category: 'park',
                count: 10
            },
            {
                category: 'historic_district',
                count: 5
            },
            {
                category: 'structure',
                count: 5
            },
            {
                category: 'temple',
                count: 10
            },
            {
                category: 'cathedral',
                count: 10
            },
            {
                category: 'fortification',
                count: 5
            }
        ]
    },
    {
        id: 2,
        city: 'Rome',
        categories: [
            {
                category: 'park',
                count: 12
            },
            {
                category: 'historic_district',
                count: 4
            },
            {
                category: 'structure',
                count: 8
            },
            {
                category: 'temple',
                count: 12
            },
            {
                category: 'cathedral',
                count: 5
            },
            {
                category: 'fortification',
                count: 2
            }
        ]
    },
    {
        id: 3,
        city: 'Barcelona',
        categories: [
            {
                category: 'park',
                count: 15
            },
            {
                category: 'historic_district',
                count: 5
            },
            {
                category: 'structure',
                count: 2
            },
            {
                category: 'temple',
                count: 5
            },
            {
                category: 'cathedral',
                count: 5
            },
            {
                category: 'fortification',
                count: 2
            }
        ]
    },
    {
        id: 4,
        city: 'Tokyo',
        categories: [
            {
                category: 'park',
                count: 20
            },
            {
                category: 'historic_district',
                count: 5
            },
            {
                category: 'structure',
                count: 10
            },
            {
                category: 'temple',
                count: 5
            },
            {
                category: 'cathedral',
                count: 8
            },
            {
                category: 'fortification',
                count: 2
            }
        ]
    },
    {
        id: 5,
        city: 'Paris',
        categories: [
            {
                category: 'park',
                count: 20
            },
            {
                category: 'historic_district',
                count: 10
            },
            {
                category: 'structure',
                count: 10
            },
            {
                category: 'temple',
                count: 5
            },
            {
                category: 'cathedral',
                count: 15
            },
            {
                category: 'fortification',
                count: 2
            }
        ]
    }
];

const visitsToAttractions = [
    {
        attraction_id: 1,
        count: 500
    },
    {
        attraction_id: 2,
        count: 850
    },
    {
        attraction_id: 3,
        count: 700
    },
    {
        attraction_id: 4,
        count: 800
    },
    {
        attraction_id: 5,
        count: 900
    },
    {
        attraction_id: 6,
        count: 1000
    },
    {
        attraction_id: 7,
        count: 300
    },
    {
        attraction_id: 8,
        count: 600
    },
    {
        attraction_id: 9,
        count: 400
    },
    {
        attraction_id: 10,
        count: 300
    }
];

const userVisitsByCategory = [
    {
        id: 1,
        name: 'Michael',
        cities: [
            {
                city_id: 1,
                visits: [
                    {
                        category: 'park',
                        count: 20
                    },
                    {
                        category: 'historic_district',
                        count: 15
                    },
                    {
                        category: 'structure',
                        count: 25
                    },
                    {
                        category: 'temple',
                        count: 30
                    },
                    {
                        category: 'cathedral',
                        count: 20
                    },
                    {
                        category: 'fortification',
                        count: 15
                    }
                ]
            },
            {
                city_id: 2,
                visits: [
                    {
                        category: 'park',
                        count: 25
                    },
                    {
                        category: 'historic_district',
                        count: 20
                    },
                    {
                        category: 'structure',
                        count: 30
                    },
                    {
                        category: 'temple',
                        count: 35
                    },
                    {
                        category: 'cathedral',
                        count: 25
                    },
                    {
                        category: 'fortification',
                        count: 10
                    }
                ]
            },
            {
                city_id: 3,
                visits: [
                    {
                        category: 'park',
                        count: 25
                    },
                    {
                        category: 'historic_district',
                        count: 10
                    },
                    {
                        category: 'structure',
                        count: 30
                    },
                    {
                        category: 'temple',
                        count: 35
                    },
                    {
                        category: 'cathedral',
                        count: 25
                    },
                    {
                        category: 'fortification',
                        count: 10
                    }
                ]
            },
            {
                city_id: 4,
                visits: [
                    {
                        category: 'park',
                        count: 40
                    },
                    {
                        category: 'historic_district',
                        count: 10
                    },
                    {
                        category: 'structure',
                        count: 50
                    },
                    {
                        category: 'temple',
                        count: 60
                    },
                    {
                        category: 'cathedral',
                        count: 15
                    },
                    {
                        category: 'fortification',
                        count: 30
                    }
                ]
            },
            {
                city_id: 5,
                visits: [
                    {
                        category: 'park',
                        count: 50
                    },
                    {
                        category: 'historic_district',
                        count: 30
                    },
                    {
                        category: 'structure',
                        count: 50
                    },
                    {
                        category: 'temple',
                        count: 45
                    },
                    {
                        category: 'cathedral',
                        count: 40
                    },
                    {
                        category: 'fortification',
                        count: 20
                    }
                ]
            }
        ]
    }
];

const attractions = [
    {
        id: 1,
        name: 'LaFayette Park',
        categories: ['park', 'historic_district']
    },
    {
        id: 2,
        name: 'Academy Park',
        categories: ['park']
    },
    {
        id: 3,
        name: 'Albany City School District',
        categories: ['structure']
    },
    {
        id: 4,
        name: 'New York State Capitol Building',
        categories: ['structure']
    },
    {
        id: 5,
        name: 'Albany City Hall',
        categories: ['structure']
    },
    {
        id: 6,
        name: 'The Roman Catholic Diocese of Albany',
        categories: ['temple']
    },
    {
        id: 7,
        name: 'New York State Court of Appeals',
        categories: ['structure']
    },
    {
        id: 8,
        name: 'The New York State Education Building',
        categories: ['structure']
    },
    {
        id: 9,
        name: 'Cathedral of All Saints',
        categories: ['cathedral']
    },
    {
        id: 10,
        name: 'Fort Frederick',
        categories: ['fortification']
    }
];

module.exports = {
    cityTypes: cityTypes,
    visitsToAttractions: visitsToAttractions,
    userVisitsByCategory: userVisitsByCategory,
    attractions: attractions
};
