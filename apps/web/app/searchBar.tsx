import { AiOutlineSearch } from 'react-icons/ai';

const SearchBar = () => {
  return (
    <div className="flex w-full flex-row items-center gap-2 overflow-clip rounded-full border border-gray-200 bg-white p-2">
      <AiOutlineSearch className="text-lg text-neutral-400" />
      <input
        type="text"
        className="grow text-sm leading-none text-neutral-600 outline-none"
        spellCheck={false}
        placeholder="Search conversations"
      />
    </div>
  );
};

export default SearchBar;
