const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

const app=express();
const PORT =3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));//url link should be true as http localhost

const MONGO_URI='mongodb+srv://DharshiniKandasamy:dharshinik@cluster0.oqi8ht8.mongodb.net/expense?retryWrites=true&w=majority&appName=Cluster0';
//http://localhost:3000/expenseDB
mongoose.connect(MONGO_URI)
    .then(()=>console.log("MongoDB connected successfully"))
    .catch(err=>{
        console.log("Mongo connection error:",err);
        process.exit(1);
    });
const expenseSchema=new mongoose.Schema({
    title:{type: String,required:true},
    amount:{type:Number,required:true},
});
const Expense=mongoose.model('Expense',expenseSchema);

app.post('/expense', async (req, res) => {
  try {
    const { title, amount } = req.body;
    const expense = new Expense({ title, amount });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ error: 'Failed to save expense' });
  }
});


app.get('/expense', async (req, res) => {
  try {
    const expenses = await Expense.find();//{title:"snacks",amount:400}
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.put('/expense/:id', async (req, res) => {
  const { title, amount } = req.body;
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { title, amount },
      { new: true }
    );
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});



app.delete('/expense/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});



app.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);

    })