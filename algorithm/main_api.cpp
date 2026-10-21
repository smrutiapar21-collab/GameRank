
#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>

using namespace std;

struct Player {
    int id;
    string player_id;
    string name;
    int score;
};

// Maintain the Max Heap property
void heapify(vector<Player>& arr, int n, int i) {
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
void buildMaxHeap(vector<Player>& arr, int n) {
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
}

// Heap Sort: sorts scores in ascending order
void heapSort(vector<Player>& arr) {
    int n = static_cast<int>(arr.size());

    buildMaxHeap(arr, n);

    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}

// Escape strings so they are safe in JSON
string escapeJSON(const string& input) {
    string output;

    for (char c : input) {
        switch (c) {
            case '"':  output += "\\\""; break;
            case '\\': output += "\\\\"; break;
            case '\n': output += "\\n";  break;
            case '\r': output += "\\r";  break;
            case '\t': output += "\\t";  break;
            default:   output += c;      break;
        }
    }

    return output;
}

int main() {
    vector<Player> players;
    string line;

    // Input format: id<TAB>player_id<TAB>name<TAB>score
    while (getline(cin, line)) {
        if (line.empty()) continue;

        stringstream ss(line);
        string idText, playerId, name, scoreText;

        if (!(ss >> idText >> playerId >> name >> scoreText)) {
            cerr << "Invalid player input format\n";
            return 1;
        }

        try {
            Player p;
            p.id = stoi(idText);
            p.player_id = playerId;
            p.name = name;
            p.score = stoi(scoreText);

            players.push_back(p);
        } catch (...) {
            cerr << "Invalid player data\n";
            return 1;
        }
    }

    heapSort(players);

    // Output highest score first as JSON
    cout << "[";

    for (int i = static_cast<int>(players.size()) - 1; i >= 0; i--) {
        if (i != static_cast<int>(players.size()) - 1) {
            cout << ",";
        }

        cout << "{\"id\":" << players[i].id
             << ",\"player_id\":\"" << escapeJSON(players[i].player_id)
             << "\",\"name\":\"" << escapeJSON(players[i].name)
             << "\",\"score\":" << players[i].score
             << "}";
    }

    cout << "]\n";

    return 0;
}
