

const PngViewer = ({ fileUrl }) => {

    return (
        <>
            <img
                src={fileUrl}
                alt=""
                style={{ maxWidth: "100%", height: "auto" }}
            />
        </>
    )
};

export default PngViewer;
