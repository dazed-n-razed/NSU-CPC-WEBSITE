const Spinner = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-gray-200">
      <div className="w-60 h-60 bg-gradient-to-tr from-blue-500 to-green-500 rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
