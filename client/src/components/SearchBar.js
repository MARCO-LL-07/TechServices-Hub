function SearchBar({ setSearch }) {

  return (

    <input
      type="text"
      className="form-control mb-4"
      placeholder="Buscar auto..."
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

  );

}

export default SearchBar;