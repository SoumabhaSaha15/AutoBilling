import { StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#cccccc',
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    width: '30%',
    alignItems: 'flex-start',
  },
  headerCenter: {
    width: '70%',
    alignItems: 'flex-start',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  brandName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  orderInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
    color: '#666666',
  },
  infoValue: {
    fontSize: 10,
    flex: 1,
    color: '#000000',
  },
  table: {
    // display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 20,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
  },
  tableColProduct: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
  },
  tableColBrand: {
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
  },
  tableColPrice: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
    textAlign: 'center',
  },
  tableColQty: {
    width: '15%',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    padding: 5,
    textAlign: 'center',
  },
  tableColTotal: {
    width: '15%',
    padding: 5,
    textAlign: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  tableCell: {
    fontSize: 10,
    color: '#000000',
  },
  summary: {
    marginTop: 20,
    borderTop: 1,
    borderTopColor: '#cccccc',
    paddingTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  summaryValue: {
    fontSize: 12,
    color: '#000000',
  },
  grandTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
  },
});
export default styles;
