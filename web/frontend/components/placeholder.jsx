
const { data: bulkData, isLoading: isBulkLoading, refetch: bulkRefetch } = useAppQuery({
    url: "/api/bulk/current",
  });

  

  const handleConvertClick = () => {
    setIsConverting(true);
    handleStartBulkOperation()
      .then(() => {
        setIsConverting(false);
        bulkRefetch();
      })
      .catch((error) => {
        console.error(error);
        setIsConverting(false);
      });
  };

  const handleDownloadClick = () => {
    const url = bulkUrl;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };