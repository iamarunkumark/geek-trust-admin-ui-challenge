import { userAPIURL } from "./tableConstants";

// A mock function to mimic making an async request for data
export function fetchUserData() {
    console.log('fetching user data');
    return fetch(userAPIURL)
      .then(res => res.json());
  }
  