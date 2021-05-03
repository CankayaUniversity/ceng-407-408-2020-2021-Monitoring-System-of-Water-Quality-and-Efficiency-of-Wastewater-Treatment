# WQPMS Data Pipeline

The water quality reading data is provided to us as a bunch of different file formats. The data from 2005 to 2016 is in Microsoft Access `.mdb` format. The 2017 data is in Word `.docx` format, 2018 data is in Excel `.xslx` format and 2020 data is in Excel `.xslm` format.

Since there are multiple data formats to be cleaned, we first read the data from said formats and generate a tab-seperated values file. Then the clean-up data-engineering work happens in `clean_csv_gen` and it generates final `.csv` files that we can use in the backend and ML modules.

To read and generate tsv files from the 2005-2016 `.mdb` files, we use `AccessReader`. 2018 and 2020 Excel files are read using a Python script, it will be added later to thiis repo.

These programs are only used during development and are not to be distributed or used in production. The dataset files are not to be shared without Ministry's permission.

## `AccessReader`

`AccessReader` is a program that reads `.mdb` files in a given folder and generates tab-seperated values.

### Installing and Running for Development

- Install [`.NET Core 3.1`](https://dotnet.microsoft.com/download/dotnet/3.1) (You can also install through Visual Studio)
- Install [`Visual Studio 2019`](https://visualstudio.microsoft.com/vs/) (Works only on Windows)
- Install `Microsoft Access .mdb Driver (x64)` (Works only on Windows)
- Import the `AccessReader.sln` through Visual Studio
- Edit the code to point to the right folder containing the `.mdb` files
- Run the code through Visual Studio

## `clean_csv_gen`

`clean_csv_gen` takes tab-seperated value files as input, cleans the data and outputs a .csv file to be used in ML and Backend modules.

### Installing and Running for Development

- Install `Nim 1.4.2` or higher
- Edit the code to point to the right tsv file.
- Execute `nimble run`
