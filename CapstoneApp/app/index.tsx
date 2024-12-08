import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, SafeAreaView,} from 'react-native';
import { useRouter } from 'expo-router';

// Define the MenuItem type outside the component
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
  const router = useRouter();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
        );
        const data = await response.json();
        setMenuItems(data.menu); // Use the exact order as in the JSON
        setFilteredItems(data.menu); // Initialize with all items
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const filterItems = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter((item) => item.category.toLowerCase() === category.toLowerCase()));
    }
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
            <Image
              source={require('../assets/images/react-logo.png')} // Replace with the actual avatar path
              style={styles.avatar}
            />
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





