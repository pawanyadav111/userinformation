import { useEffect, useState } from 'react';
import axios from 'axios';

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pastSearchTerms, setPastSearchTerms] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(data);
      } 
      catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const filtered = users
        .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));
      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term && !pastSearchTerms.includes(term)) {
      setPastSearchTerms([...pastSearchTerms, term]);
    }
  };

  const handleSortByName = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));
    setFilteredUsers(sortedUsers);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4 text-gray-800'>User Information</h1>
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Search here by name'
          value={searchTerm}
          onChange={handleSearch}
          className='p-2 rounded-md border border-gray-500 focus:outline-none focus:border-blue-500'
        />
        <button onClick={handleSortByName} className='ml-2 p-2 rounded-md bg-blue-700 text-white'>
          Sort by Name
        </button>
      </div>
      <div className='mb-4'>
        <h2 className='text-lg font-bold mb-2 text-gray-800'>Past Searches:</h2>
        <ul className='list-disc pl-4 text-gray-600'>
          {pastSearchTerms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
      
      {filteredUsers.map((user, userIndex) => (
        <div key={userIndex} className='border rounded-lg p-4 mb-4 bg-white shadow-md'>
          <h1 className='text-xl font-semibold mb-2 text-blue-800'>{user.name}</h1>
          <p className='text-gray-600'>
            <strong>User ID:</strong> {user.id}
          </p>
          <p className='text-gray-600'>
            <strong>Username:</strong> {user.username}
          </p>
          <p className='text-gray-600'>
            <strong>Website:</strong> {user.website}
          </p>
          <p className='text-rose-600'>
            <strong>Address:</strong> {`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}
          </p>
        </div>
      ))}
    </div>
  );
};

export default User;
