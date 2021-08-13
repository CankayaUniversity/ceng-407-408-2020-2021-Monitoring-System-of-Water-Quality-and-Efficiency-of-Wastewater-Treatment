using System;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Collections.Generic; // List<T>, HashSet<T>, ...
using System.Globalization;       // CultureInfo
using System.Text;

namespace AccessReader
{
    class Program
    {
        static string folder = "A:\\mdb_databases";
        static StreamWriter writer = new StreamWriter(folder + "\\tsv.txt");
        static StreamWriter empty_writer = new StreamWriter(folder + "\\tsv_empty.txt");

        static void Main(string[] args)
        {
            // string cwd = Directory.GetCurrentDirectory();
            // Console.WriteLine("cwd is " + cwd); // NOTE Getting the file from cwd doesn't work currently. Access Driver complains because of not having permissions (?).


            var filePaths = GetDBFilePaths(Program.folder);

            // var allUniqueColumnNames = new HashSet<string>();
            // var allUniqueNBY = new HashSet<string>();

            foreach (var filePath in filePaths)
            {
                var (columnSet, numuneBolgeYer) = GetUniqueColumnNamesForFile(filePath);
                // Console.WriteLine("Unique columns and types for " + filePath);

                // allUniqueNBY.UnionWith(numuneBolgeYer);
                // allUniqueColumnNames.UnionWith(columnSet);
            }

            //var sortedNBY = new SortedSet<string>();
            //sorted.UnionWith(allUniqueNBY);
            //foreach (var nby in sorted)
            //{
            //    Console.WriteLine(nby);
            //}

            // var sortedColumns = new SortedSet<string>();
            // sortedColumns.UnionWith(allUniqueColumnNames);
            // foreach (string uniqueColumn in sortedColumns)
            // {
            //     Console.WriteLine(uniqueColumn);
            // }

            writer.Close();
        }

        private static List<string> GetTableNames(string connectionStr)
        {
            using (OdbcConnection connection = new OdbcConnection(connectionStr))
            {
                connection.Open();

                var names = new List<string>();
                System.Data.DataTable dataTable = connection.GetSchema("Tables");
                // Columns for "Tables" table: TABLE_CAT, TABLE_SCHEM, TABLE_NAME, TABLE_TYPE, REMARKS

                DataTableReader dtr = new DataTableReader(dataTable);

                do
                {
                    while (dtr.Read())
                    {
                        if ((string)dtr["TABLE_TYPE"] == "TABLE")
                        {
                            var name = dtr["TABLE_NAME"];

                            if (name.GetType() == typeof(System.String))
                            {
                                names.Add((string)name);
                            }
                            else
                            {
                                Console.WriteLine("Weird stuff is going on. Investigate!");
                            }
                        }
                    }
                } while (dtr.NextResult());

                return names;
            }
        }


        private static List<string> GetDBFilePaths(string folderPath)
        {
            DirectoryInfo d = new DirectoryInfo(folderPath);

            var filePaths = new List<string>();

            foreach (var file in d.GetFiles("*.mdb"))
            {
                filePaths.Add(file.ToString());
            }

            return filePaths;
        }

        private static (HashSet<string>, HashSet<string>) GetUniqueColumnNamesForFile(string filePath)
        {
            var connectionStr = "Driver={Microsoft Access Driver (*.mdb, *.accdb)}; Dbq=" + filePath + "; Uid = Admin; Pwd =;";

            // Console.WriteLine("Connection string is: " + connectionStr);
            Console.WriteLine("Current access file: " + filePath);

            var tableNames = GetTableNames(connectionStr);

            // var columnSet = new HashSet<string>();

            // var numuneBolgeYerCombos = new HashSet<string>();

            foreach (var tblname in tableNames)
            {
                // Console.WriteLine(tblname);

                if (tblname.StartsWith("~TMP") || tblname.Contains('$') || tblname.Contains("Copy of"))
                {
                    // There is a problem with tables starting with ~TMP, they shouldn't even exist! TODO
                    // The same is true for table names that contain $.
                    continue;
                }

                // A small optimization to not call everytime we read data.
                StringBuilder sb = new StringBuilder();

                using (OdbcConnection connection = new OdbcConnection(connectionStr))
                {
                    connection.Open();
                    var query = "select * from " + tblname + ""; // Get all data from the table.

                    try
                    {
                        OdbcCommand command = new OdbcCommand(query, connection);

                        OdbcDataReader data = command.ExecuteReader();
                        System.Data.DataTable dataTable = data.GetSchemaTable();

                        // Schema for tables:
                        // ColumnName (System.String), ColumnOrdinal (System.Int32), ColumnSize (System.Int32),
                        // NumericPrecision (System.Int16), NumericScale (System.Int16), DataType (System.Object),
                        // ProviderType (System.Int32), IsLong (System.Boolean), AllowDBNull (System.Boolean),
                        // IsReadOnly (System.Boolean), IsRowVersion (System.Boolean), IsUnique (System.Boolean),
                        // IsKey (System.Boolean), IsAutoIncrement (System.Boolean),
                        // BaseSchemaName (System.String), BaseCatalogName (System.String), BaseTableName (System.String), BaseColumnName (System.String)
                        var set = new HashSet<(string, string)>();
                        foreach (DataRow row in dataTable.Rows)
                        {
                            string name = row["ColumnName"].ToString();
                            string type = row["DataType"].ToString();

                            set.Add((name, type));
                        }

                        uint rowCount = 0;
                        while (data.Read())
                        {
                            foreach (var (colName, colType) in set)
                            {
                                var content = "";
                                try
                                {
                                    content = data[colName].ToString();
                                }
                                catch (System.Exception)
                                {
                                    Console.WriteLine("Error: No " + colName + " field.");
                                }

                                content.Replace('\r', ' '); // We don't want newlines in the content
                                content.Replace('\n', ' ');
                                content = content.Trim();   // Some rows contain a lot of whitespace and no content. We forgot to check for those!

                                if (content != "" && content != "-" && colName != "No" && colName != "Kimlik")
                                {
                                    var toPrint = filePath + "\t" + tblname + "\t(" + rowCount + ")\t" + colName + "\t" + colType + "\t" + content;
                                    sb.Append(toPrint);
                                    sb.AppendLine();
                                }

                                // No need to log the empty stuff anymore.
                                /* else
                                {
                                    empty_writer.WriteLine(toPrint);
                                }
                                */
                            }
                            rowCount += 1;
                        }

                        // HashSet<string> numuneBolgeYer = NumuneBolgeYer(data);
                        // numuneBolgeYerCombos.UnionWith(numuneBolgeYer);
                    }
                    catch (System.Exception e)
                    {
                        Console.WriteLine("Error while executing query: " + query);
                        Console.WriteLine(e);
                    }
                }

                writer.Write(sb.ToString()); // The optimization
            }
            return (null, null); //(columnSet, numuneBolgeYerCombos);
        }

        private static HashSet<string> NumuneBolgeYer(OdbcDataReader data)
        {
            var nby = new HashSet<string>();

            while (data.Read())
            {
                var numune = data["NUMUNE_ADI"].ToString();
                var bolge = data["BOLGE_ADI"].ToString();
                var yer = data["YER"].ToString();

                var delim = "<|>";

                var item = numune + delim + bolge + delim + yer;

                nby.Add(item);
            }

            return nby;
        }
    }
}
