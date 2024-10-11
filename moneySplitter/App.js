import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

export default function App() {
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [sumAmount, setSumAmount] = useState(0.0);
  const [avg, setAvg] = useState(0.0);
  const [names, setNames] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const validateInputs = () => {
    if (numberOfUsers <= 0) {
      Alert.alert("Invalid Input", "Number of users must be greater than 0");
      return false;
    }
    if (sumAmount <= 0) {
      Alert.alert("Invalid Input", "Total sum amount must be greater than 0");
      return false;
    }
    return true;
  };

  const calculateSplit = () => {
    if (validateInputs()) {
      const average = sumAmount / numberOfUsers;
      setAvg(average);
      setNames(new Array(numberOfUsers).fill(""));
      setContributions(new Array(numberOfUsers).fill(0));
      setUserResults(new Array(numberOfUsers).fill(""));
    }
  };

  const calculateContributions = () => {
    const toReceive = [];
    const toPay = [];
    const results = new Array(numberOfUsers).fill("");

    contributions.forEach((contribution, i) => {
      if (contribution > avg) {
        toReceive.push({ index: i, amount: contribution - avg });
        results[i] = `You need to receive Rs ${(contribution - avg).toFixed(2)}`;
      } else if (contribution === avg) {
        results[i] = `You paid exactly Rs ${avg.toFixed(2)}`;
      } else {
        toPay.push({ index: i, amount: avg - contribution });
        results[i] = `Pay total Extra Rs ${(avg - contribution).toFixed(2)}`;
      }
    });

    toPay.forEach((debtor) => {
      let debt = debtor.amount;
      toReceive.forEach((creditor) => {
        if (debt > 0 && creditor.amount > 0) {
          const settlement = Math.min(creditor.amount, debt);
          creditor.amount -= settlement;
          debt -= settlement;
          results[debtor.index] += `\nYou pay Rs ${settlement.toFixed(2)} to User ${creditor.index + 1}`;
        }
      });
      if (debt > 0) {
        results[debtor.index] += `\nYou still need to pay Rs${debt.toFixed(2)}`;
      }
    });

    setUserResults(results);
  };

  const handleContributionChange = (index, value) => {
    const updatedContributions = [...contributions];
    const parsedValue = parseFloat(value);
    updatedContributions[index] = isNaN(parsedValue) ? 0 : parsedValue;
    setContributions(updatedContributions);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Money Splitter App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter number of users"
        keyboardType="numeric"
        onChangeText={(value) => setNumberOfUsers(parseInt(value) || 0)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter total sum amount"
        keyboardType="numeric"
        onChangeText={(value) => setSumAmount(parseFloat(value) || 0)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Set Users & Calculate Split" onPress={calculateSplit} color="#007BFF" />
      </View>

      {avg > 0 && (
        <View style={styles.avgContainer}>
          <Text style={styles.averageText}>All users to pay: Rs {avg.toFixed(2)}</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {names.map((_, index) => (
          <View style={styles.card} key={index}>
            <Text style={styles.userLabel}>User {index + 1}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter contribution of user ${index + 1}`}
              keyboardType="numeric"
              onChangeText={(value) => handleContributionChange(index, value)}
            />
            {userResults[index] && <Text style={styles.result}>{userResults[index]}</Text>}
          </View>
        ))}
      </ScrollView>

      {avg > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Submit Contributions" onPress={calculateContributions} color="#28A745" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  scrollView: {
    marginTop: 20,
  },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  userLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  result: {
    marginTop: 10,
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
    backgroundColor: "#E9ECEF",
    padding: 10,
    borderRadius: 8,
  },
  avgContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  averageText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});
