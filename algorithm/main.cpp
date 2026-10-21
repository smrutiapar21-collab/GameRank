#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

struct Player {
    string name;
    int id;
    int score;
};

// Maintain the Max Heap property
void heapify(Player arr[], int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left].score > arr[largest].score)
        largest = left;

    if (right < n && arr[right].score > arr[largest].score)
        largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

// Build a Max Heap
void buildMaxHeap(Player arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

// Sort players by score using Heap Sort
void heapSort(Player arr[], int n) {
    buildMaxHeap(arr, n);

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

// Display player records
void displayPlayers(Player arr[], int n) {
    cout << "\n";
    cout << "ID\tName\tScore\n";
    cout << "--------------------------\n";

    for (int i = 0; i < n; i++) {
        cout << arr[i].id << "\t"
             << arr[i].name << "\t"
             << arr[i].score << "\n";
    }
}

// Display leaderboard: highest score first
void displayLeaderboard(Player arr[], int n) {
    cout << "\n========== GAME LEADERBOARD ==========\n";
    cout << "Rank\tName\tScore\n";
    cout << "-------------------------------------\n";

    int rank = 1;
    for (int i = n - 1; i >= 0; i--) {
        cout << rank++ << "\t"
             << arr[i].name << "\t"
             << arr[i].score << "\n";
    }
}

int main() {
    int n;

    cout << "Enter number of players (1-100): ";
    if (!(cin >> n) || n < 1 || n > 100) {
        cout << "Invalid number of players.\n";
        return 1;
    }

    Player players[100];

    for (int i = 0; i < n; i++) {
        cout << "\nEnter details for Player " << i + 1 << "\n";

        cout << "Player ID: ";
        if (!(cin >> players[i].id)) {
            cout << "Invalid player ID.\n";
            return 1;
        }

        cout << "Player name (one word): ";
        cin >> players[i].name;

        cout << "Game score: ";
        if (!(cin >> players[i].score) || players[i].score < 0) {
            cout << "Invalid score.\n";
            return 1;
        }
    }

    cout << "\nOriginal Player Records:";
    displayPlayers(players, n);

    // Sort records using Heap Sort
    heapSort(players, n);

    displayLeaderboard(players, n);

    return 0;
}
