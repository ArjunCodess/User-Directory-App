// userService.js
export async function fetchUsers() {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
}