function Manage(){

    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/rest/manager',{credentials: 'include'})
        .then(res = res.json())
        .then(data => {
            setContentList(data.data);
        })
    }, [])

    return(
        <>
          <div>
            <table>
                <thead>
                    <tr>
                        <th>寄件人</th>
                        <th>收件人</th>
                        <th>總金額</th>
                        <th>截止日期</th>
                        <th>訂單狀態</th>
                    </tr>
                </thead>
                <tbody>
                    {contentList.map(content => {
                        <tr>
                            <td>{content.contentFinalDate}</td>
                            <td>{content.contentFinalDate}</td>
                            <td>{content.contentPrice}</td>
                            <td>{content.contentFinalDate}</td>
                            <td>{content.contentState}</td>
                        </tr>
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td>

                        </td>
                    </tr>
                </tfoot>
            </table>
          </div>
        </>
    )
}

export default Manage;