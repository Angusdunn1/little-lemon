import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface MenuItem {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const Home = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [avatar, setAvatar] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
        );
        const data = await response.json();
        setMenuItems(data.menu);
        setFilteredItems(data.menu);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        try {
          const storedAvatar = await AsyncStorage.getItem('avatar');
          const firstName = await AsyncStorage.getItem('firstName');
          const lastName = await AsyncStorage.getItem('lastName');

          setAvatar(storedAvatar);
          setInitials(
            `${firstName?.[0]?.toUpperCase() || ''}${lastName?.[0]?.toUpperCase() || ''}`
          );
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      };

      loadProfileData();
    }, [])
  );

  // Filter menu items by category and search query
  const filterItems = (category: string) => {
    setSelectedCategory(category);
    let filtered = menuItems;
    if (category !== 'All') {
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(filtered);
  };

  // Update search query and filter items
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(
      selectedCategory === 'All'
        ? filtered
        : filtered.filter(
            (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
          )
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const imageUrl = `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`;
    return (
      <View style={styles.menuItem}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.price}>${parseFloat(item.price.toString()).toFixed(2)}</Text>
        </View>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍋 Little Lemon</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholder]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Little Lemon</Text>
            <Text style={styles.heroSubtitle}>Chicago</Text>
            <Text style={styles.heroDescription}>
              We are a family-owned Mediterranean restaurant focused on traditional recipes served
              with a modern twist.
            </Text>
          </View>
          <Image
            source={{
              uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/bruschetta.jpg?raw=true',
            }}
            style={styles.heroImage}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a dish..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Horizontal Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {['All', 'Starters', 'Mains', 'Desserts', 'Sides'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.selectedFilterButton,
              ]}
              onPress={() => filterItems(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.selectedFilterText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#495E57',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F4CE14',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    backgroundColor: '#ccc',
  },
  initials: {
    fontSize: 16,
    color: '#fff',
  },
  heroSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#EDEFEE',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 2,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#495E57',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#333',
    marginTop: 4,
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  heroImage: {
    flex: 1,
    width: 120,
    height: 120,
    borderRadius: 8,
    marginLeft: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  filtersContainer: {
    backgroundColor: '#EDEFEE',
    paddingVertical: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedFilterButton: {
    backgroundColor: '#495E57',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  selectedFilterText: {
    color: '#fff',
  },
  list: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    padding: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  info: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495E57',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default Home;




