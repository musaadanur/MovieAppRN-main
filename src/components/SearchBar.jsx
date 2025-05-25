import React from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native'
import colors from '../theme/colors'

const SearchBar = ({ query, setQuery, onSearch, onClear }) => {
  return (
    <View style={styles.searchRow}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Film ara..."
          placeholderTextColor={colors.mutedText}
          value={query}
          onChangeText={(text) => {
            setQuery(text)
            if (text.trim() === '') onClear()
          }}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('')
              onClear()
            }}
          >
            <Text style={styles.clearText}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {query.length > 0 && (
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Ara</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearText: {
    color: colors.secondary,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  searchButtonText: {
    color: colors.background,
    fontWeight: 'bold',
  },
})

export default SearchBar
