- **python语言**

- **`一数据转换题目`** 看到数据转换的类型就套用

- \#TempConvert.py                                                   

  `TempStr = input("请输入带有符号的温度值")`

  `if len(TempStr) > 1 and TempStr[-1] in ['F', 'f']:`

    `C = (float(TempStr[0:-1]) - 32) / 1.8`

    `print("转换后的温度是{:.2f}C".format(C))`

  `elif len(TempStr) > 1 and TempStr[-1] in ['C', 'c']:`

    `F = 1.8 * float(TempStr[0:-1]) + 32`

    `print("转换输出后的温度是{:.2f}F".format(F))`

  `else:`

    `print("输入格式错误")`   

